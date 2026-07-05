namespace GolfAppAPI.Models {
    public class CourseHoleCoordinate {

        public int courseHoleCoordinateId { get; set; }
        public float latitude { get; set; }
        public float longitude { get; set; }


        public int courseHoleId { get; set; }
        public int coordinateTypeId { get; set; }

        public virtual CourseHole CourseHole { get; set; }
        public virtual CoordinateType CoordinateType { get; set; }

    }
}
