using GolfAppAPI.Models;

namespace GolfAppAPI.DAL {
    public interface ICourseRepository {

        public Task<IEnumerable<Course>> SearchCourses(string name);

        public Task<Course> GetServiceCourse(int id);

        public Task<bool> CreateCourse(int id);

        public Task<Course> GetCourse(int id);

        public Task<IEnumerable<Course>> GetAllCourses();

    }
}
