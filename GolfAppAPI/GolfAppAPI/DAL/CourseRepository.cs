using GolfAppAPI.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using static GolfAppAPI.DTO.CourseDTO;

namespace GolfAppAPI.DAL {
    public class CourseRepository : ICourseRepository {

        private readonly GolfAppDbContext _context;
        private readonly HttpClient _httpClient;

        
        public CourseRepository(GolfAppDbContext context, HttpClient httpClient) {
            _context = context;
            _httpClient = httpClient;
        }


        public async Task<IEnumerable<Course>> SearchCourses(string name) {

            var courseList = new List<Course>();

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Key 5PBJCZK2YC67AFSA5AOFZSU5HY"); // place key in .env

            string endpoint = $"https://api.golfcourseapi.com/v1/search?search_query={name}";

            HttpResponseMessage response = await _httpClient.GetAsync(endpoint);

            if (response.IsSuccessStatusCode) {
                string responseData = await response.Content.ReadAsStringAsync();
                var wrapper = JsonConvert.DeserializeObject<CourseSearchResponse>(responseData);

                return wrapper.Courses.Select(c => new Course {
                    courseId = c.Id,
                    name = c.ClubName,
                    address = c.Location.Address,
                    city = c.Location.City,
                    state = c.Location.State,
                    country = c.Location.Country,
                    latitude = c.Location.Latitude,
                    longitude = c.Location.Longitude
                }).ToList();
            }


            return courseList;

        }


        public async Task<Course> GetServiceCourse(int id) {
            Course course = null;

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Key 5PBJCZK2YC67AFSA5AOFZSU5HY"); // place key in .env

            string endpoint = $"https://api.golfcourseapi.com/v1/courses/{id}";

            HttpResponseMessage response = await _httpClient.GetAsync(endpoint);

            if (response.IsSuccessStatusCode) {
                string responseData = await response.Content.ReadAsStringAsync();
                var wrapper = JsonConvert.DeserializeObject<CourseSingleResponse>(responseData);

                return new Course {
                    name = wrapper.Course.ClubName,
                    address = wrapper.Course.Location.Address,
                    city = wrapper.Course.Location.City,
                    state = wrapper.Course.Location.State,
                    country = wrapper.Course.Location.Country,
                    latitude = wrapper.Course.Location.Latitude,
                    longitude = wrapper.Course.Location.Longitude,
                };
            }

            return course;
        }


        public async Task<bool> CreateCourse(int id) {

            Course newCourse = await GetServiceCourse(id);

            try {

                _context.Courses.Add(newCourse);
                await _context.SaveChangesAsync();

                return true;

            } catch (DbUpdateException ex) {

                return false;

            }
        }

        public async Task<Course> GetCourse(int id) {
            
            var course = await _context.Courses.Where(c => c.courseId == id).FirstOrDefaultAsync();

            return course;
        }

        public async Task<IEnumerable<Course>> GetAllCourses() {

            var courses = await _context.Courses.ToListAsync();

            return courses;
        }




    }
}
