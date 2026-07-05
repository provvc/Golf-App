namespace GolfAppAPI.Models {
    public class CourseHole {

        public int courseHoleId { get; set; }
        public int courseHoleNumber { get; set; }
        public int par { get; set; }

        public int courseId { get; set; }

        public virtual Course Course { get; set; }
        public virtual ICollection<CourseHoleCoordinate> CourseHoleCoordinates { get; set; }
    }
}
