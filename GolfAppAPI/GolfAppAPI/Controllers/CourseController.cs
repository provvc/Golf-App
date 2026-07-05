using GolfAppAPI.DAL;
using GolfAppAPI.DTO;
using GolfAppAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Runtime.InteropServices;
using static GolfAppAPI.DTO.CourseDTO;

namespace GolfAppAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase {

        private readonly ICourseRepository _courseRepository;


        public CourseController(ICourseRepository courseRepository) {

            _courseRepository = courseRepository;
        }


        [HttpGet("service/courses/{name}")]
        public async Task<ActionResult<IEnumerable<Course>>> SearchCourseByName(string name) {

            var courseList = await _courseRepository.SearchCourses(name);

            if (courseList == null) {
                return NotFound();
            }
            
            return Ok(courseList);
        }


        [HttpGet("service/course/{id}")]
        public async Task<ActionResult<Course>> GetServiceCourseById(int id) {

            Course course = await _courseRepository.GetServiceCourse(id);

            if (course == null) {
                return NotFound();
            }

            return Ok(course);
        }


        [HttpPost("course/{id}")]
        public async Task<IActionResult> AddCourse(int id) {

            var success = await _courseRepository.CreateCourse(id);

            if (!success) {
                return BadRequest("The attempted creation of a course entry failed to meet the database constraints.");
            }

            return Ok();
        }

        [HttpGet("course/{id}")]
        public async Task<ActionResult<Course>> GetCourseById(int id) {

            Course course = await _courseRepository.GetCourse(id);

            if (course == null) {
                return NotFound();
            }

            return Ok(course);

        }

        [HttpGet("courses")]
        public async Task<ActionResult<IEnumerable<Course>>> GetAllCourses() {

            var courseList = await _courseRepository.GetAllCourses();

            if (courseList == null) {
                return NotFound();
            }

            return Ok(courseList);

        }
        
}
}
