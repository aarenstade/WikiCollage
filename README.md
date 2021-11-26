# Visual Collab

Draw, write text, or add images to an open canvas (10,000px x 10,000px), pay to save your additions.

# Design Ideas

-- ViewController
-- gives us position and zoom data
-- send that data through custom hook

-- Canvas
-- interactive html canvas layer which allows us to draw, add text, and add/scale images
-- canvas maps to mural dimensions
-- on submission - capture full canvas image url - get x, y of top left corner - get total dimensions of canvas - then algorithm to embed additions into mural grid - break canvas image into mural grid images w/ transparent background - combine canvas grid images with mural grid images, and save new state

-- Mural
-- previous state grid of images
-- procedurally loaded based on ViewController hook, (if mural tile would be in view)

# Database Schema

Storage
/layers/layer*[uuid].jpg <-- individual submission layers
/murals/mural*[uuid].jpg <-- full compiled murals

Database
wait_period: [ms],
latest_submission: {
mural: [mural_url],
layer: [layer_url],
name: [name],
timestamp: [timestamp],
}
submissions: [
{[latest_submission_type]},
...
]
