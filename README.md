# Golf App

Golf App used to track and record yardage, strokes, and personal bests for any local golf course via an interactive map.

## Technologies

TypeScript,
ReactNative,
Expo,
C#,
Entity Framework Core,
ASP.NET Core Web API

## External Services

### OpenStreetMap

Essentially, an interactive gps map with crowdsourced data points (nodes) with key-value pair tags for those data points, these data points being locations on a map (i.e., buildings, parks, golf courses, etc.).

### Overpass API

OpenStreetMap (OSM) is acquainted by Overpass API which I can use to query location, type of objects, tag properties, proximity, or combinations of them, and recieve a JSON response with information regarding those nodes (i.e., latitude, longitude).

## Current Issues

- When querying for the map data points, I give it the approximate geolocation of the golf course and search within a 1500m radius for all the golf holes. However, some golf courses are within a 1500m radius of other golf courses, therefore, there are hole mismatches for some courses.

- Some hole nodes are misplaced on the OSM map and are inaccurate (i.e., the tee box node is slightly off the actual tee box), therefore creating data inaccuracy and a visually unappealing hole line.

- OSM has some duplicate hole data (i.e., hole one will have duplicate/ or two different hole lines for that same hole, making a dual entry when seeding into database)

## Currently Working On

1. Adding manual yardage tracker for holes
2. Adding gps yardage tracker for holes
3. Fixing current issues ^^^

## What is done/working

- API Endpoints for adding a course and its course holes to the database
- API Endpoints for retrieving those courses and course holes from the database
- The styled view for seeing and searching up different courses
- The view for seeing the course preview, i.e., looking at a map view of each hole

