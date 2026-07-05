using Newtonsoft.Json;

namespace GolfAppAPI.DTO {
    public class CourseDTO {
        public class CourseSearchResponse {
            [JsonProperty("courses")]
            public List<CourseDto> Courses { get; set; }
        }

        public class CourseSingleResponse {
            [JsonProperty("course")]
            public CourseDto Course { get; set; }
        }

        public class CourseDto {
            [JsonProperty("id")]
            public int Id { get; set; }

            [JsonProperty("club_name")]
            public string ClubName { get; set; }

            [JsonProperty("location")]
            public LocationDto Location { get; set; }
        }

        public class LocationDto {
            [JsonProperty("address")]
            public string Address { get; set; }

            [JsonProperty("city")]
            public string City { get; set; }

            [JsonProperty("state")]
            public string State { get; set; }

            [JsonProperty("country")]
            public string Country { get; set; }

            [JsonProperty("latitude")]
            public float Latitude { get; set; }

            [JsonProperty("longitude")]
            public float Longitude { get; set; }
        }
    }
}
