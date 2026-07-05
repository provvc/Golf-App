using Newtonsoft.Json;

namespace GolfAppAPI.DTO {
    public class CourseHoleDTO {
        public class OverpassResponse {
            [JsonProperty("elements")]
            public List<OverpassElement> Elements { get; set; }
        }

        public class OverpassElement {
            [JsonProperty("type")]
            public string Type { get; set; }

            [JsonProperty("id")]
            public long Id { get; set; }

            // For nodes
            [JsonProperty("lat")]
            public float? Lat { get; set; }

            [JsonProperty("lon")]
            public float? Lon { get; set; }

            // For ways
            [JsonProperty("nodes")]
            public List<long> Nodes { get; set; }

            [JsonProperty("tags")]
            public Dictionary<string, string> Tags { get; set; }
        }

        public class HoleResponse {
            public int courseHoleId { get; set; }
            public int courseHoleNumber { get; set; }
            public int par { get; set; }
            public CoordResponse tee { get; set; }
            public CoordResponse green { get; set; }
            public List<CoordResponse> fullLine { get; set; }
        }

        public class CoordResponse {
            public double latitude { get; set; }
            public double longitude { get; set; }
        }

    }
}
