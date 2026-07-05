using GolfAppAPI.DTO;
using GolfAppAPI.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static GolfAppAPI.DTO.CourseHoleDTO;

namespace GolfAppAPI.DAL {
    public class CourseHoleRepository : ICourseHoleRepository {

        private readonly GolfAppDbContext _context;
        private readonly HttpClient _httpClient;
        private const int COURSE_RADIUS = 1500; // UoM == Metres


        public CourseHoleRepository(GolfAppDbContext context, HttpClient httpClient) { 
            _context = context;
            _httpClient = httpClient;
        }


        public async Task<IEnumerable<CourseHole>> GetServiceCourseHoles(int id, int radiusMeters = COURSE_RADIUS) {

            var course = await _context.Courses.Where(c => c.courseId == id).FirstOrDefaultAsync();
            
            if (course == null) {
                return null;
            }

            string query = $@"
                    [out:json][timeout:25];
                    way[""golf""=""hole""](around:{radiusMeters},{course.latitude},{course.longitude});
                    out body;
                    >;
                    out skel qt;
                ";

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Accept", "*/*");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "GolfAppAPI/1.0");

            var content = new FormUrlEncodedContent(new[] {
                new KeyValuePair<string, string>("data", query)
            });

            var response = await _httpClient.PostAsync("https://overpass-api.de/api/interpreter", content);
            //string responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode) {
                throw new HttpRequestException($"Overpass API returned {response.StatusCode}");
            }

            string responseData = await response.Content.ReadAsStringAsync();
            var overpassResponse = JsonConvert.DeserializeObject<OverpassResponse>(responseData);

            var holes = ParseGolfHoles(overpassResponse.Elements, id); // once overpass hole data is retrieved; filter and organize, then return

            return holes;
        }

        public async Task<bool> CreateCourseHoles(int id) {

            IEnumerable<CourseHole> courseHoles = await GetServiceCourseHoles(id);

            if (courseHoles == null || !courseHoles.Any()) {
                return false;
            }

            try {

                _context.CourseHoles.AddRange(courseHoles);
                await _context.SaveChangesAsync();

                return true;

            } catch (DbUpdateException ex) {

                return false;

            }
        }

        public async Task<IEnumerable<HoleResponse>> GetCourseHoles(int id) {

            var courseHoles = await _context.CourseHoles.Where(c => c.courseId == id).Include(ch => ch.CourseHoleCoordinates).ToListAsync();


            return courseHoles.Select(h => new HoleResponse {
                 courseHoleId = h.courseHoleId,
                 courseHoleNumber = h.courseHoleNumber,
                 par = h.par,
                 tee = h.CourseHoleCoordinates
                     .Where(c => c.coordinateTypeId == 1)
                     .Select(c => new CoordResponse { latitude = c.latitude, longitude = c.longitude })
                     .FirstOrDefault(),
                 green = h.CourseHoleCoordinates
                     .Where(c => c.coordinateTypeId == 2)
                     .Select(c => new CoordResponse { latitude = c.latitude, longitude = c.longitude })
                     .FirstOrDefault(),
                 fullLine = h.CourseHoleCoordinates
                     .Where(c => c.coordinateTypeId == 3)
                     .OrderBy(c => c.courseHoleCoordinateId)
                     .Select(c => new CoordResponse { latitude = c.latitude, longitude = c.longitude })
                     .ToList()
             });

        }


        private IEnumerable<CourseHole> ParseGolfHoles(List<OverpassElement> elements, int courseId) {

            var nodes = elements
                .Where(e => e.Type == "node")
                .ToDictionary(e => e.Id, e => new { e.Lat, e.Lon });

            return elements
                .Where(e => e.Type == "way" && e.Tags?.GetValueOrDefault("golf") == "hole")
                .Where(e => e.Tags.ContainsKey("ref") && e.Tags.ContainsKey("par"))
                .Select(way => {
                    var coords = way.Nodes
                        .Where(id => nodes.ContainsKey(id))
                        .Select(id => nodes[id])
                        .ToList();

                    var holeCoords = new List<CourseHoleCoordinate>();

                    // Tee
                    holeCoords.Add(new CourseHoleCoordinate {
                        latitude = coords.First().Lat ?? 0,
                        longitude = coords.First().Lon ?? 0,
                        coordinateTypeId = 1,
                    });

                    // Green
                    holeCoords.Add(new CourseHoleCoordinate {
                        latitude = coords.Last().Lat ?? 0,
                        longitude = coords.Last().Lon ?? 0,
                        coordinateTypeId = 2,
                    });

                    // Full line
                    holeCoords.AddRange(coords.Select((coord, index) => new CourseHoleCoordinate {
                        latitude = coord.Lat ?? 0,
                        longitude = coord.Lon ?? 0,
                        coordinateTypeId = 3,
                    }));

                    return new CourseHole {
                        courseId = courseId,
                        courseHoleNumber = int.Parse(way.Tags["ref"]),
                        par = int.Parse(way.Tags["par"]),
                        CourseHoleCoordinates = holeCoords,
                    };
                })
                .OrderBy(h => h.courseHoleNumber)
                .ToList();
        }

    }
}  
