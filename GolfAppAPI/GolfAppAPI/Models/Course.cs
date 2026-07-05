using Newtonsoft.Json;

namespace GolfAppAPI.Models {
    public class Course {

        public int courseId { get; set; }
        public string name { get; set; }
        public string address { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }
        public string city { get; set; }
        public string state { get; set; }
        public string country { get; set; }

        public virtual ICollection<CourseHole> CourseHoles { get; set; }

    }
}
