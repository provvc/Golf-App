using GolfAppAPI.DAL;
using GolfAppAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GolfAppAPI.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class CourseHoleController : ControllerBase {

        private readonly ICourseHoleRepository _courseHoleRepository;

        public CourseHoleController(ICourseHoleRepository courseHoleRepository) {
        
            _courseHoleRepository = courseHoleRepository;

        }


        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<CourseHole>>> GetServiceCourseHolesById(int id) {

            var courseHoles = await _courseHoleRepository.GetServiceCourseHoles(id);
            
            if (courseHoles == null) {
                return NotFound();
            }

            return Ok(courseHoles);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> AddCourseHoles(int id) {

            var success = await _courseHoleRepository.CreateCourseHoles(id);

            if (!success) {
                return BadRequest("The attempted creation of a course's hole entries failed to meet the database constraints.");
            }

            return Ok();

        }

        [HttpGet("course/{id}")]
        public async Task<ActionResult<IEnumerable<CourseHole>>> GetCourseHolesById(int id) {

            var courseHoles = await _courseHoleRepository.GetCourseHoles(id);

            if (courseHoles == null) {
                return NotFound();
            }

            return Ok(courseHoles);

        }
    }
}
