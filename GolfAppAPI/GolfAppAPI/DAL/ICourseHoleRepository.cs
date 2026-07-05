using GolfAppAPI.Models;
using static GolfAppAPI.DTO.CourseHoleDTO;

namespace GolfAppAPI.DAL {
    public interface ICourseHoleRepository {

        private const int COURSE_RADIUS = 1500; // UoM == Metres

        public Task<IEnumerable<CourseHole>> GetServiceCourseHoles(int id, int radiusMeters = COURSE_RADIUS);

        public Task<bool> CreateCourseHoles(int id);

        public Task<IEnumerable<HoleResponse>> GetCourseHoles(int id);

    }
}
