# Component Design Specifications

## 1. ImageUploader.vue

### Purpose
Allow users to upload images for watermarking with preview capabilities.

### Props
- None

### Events
- `images-uploaded`: Emits array of uploaded images with metadata

### Features
- File input with drag and drop support
- Multiple image selection
- Image preview thumbnails
- Validation for supported image formats (JPG, PNG, GIF)
- Progress indicators for large uploads
- Clear all button

### UI Components
- UButton for file selection
- UCard for preview area
- UBadge for file count
- UProgress for upload progress

## 2. WatermarkConfig.vue

### Purpose
Provide configuration options for text watermarks.

### Props
- `watermark`: Object containing current watermark settings

### Events
- `update:watermark`: Emits updated watermark configuration

### Watermark Properties
- `text`: String - watermark text content
- `fontSize`: Number - font size in pixels
- `color`: String - hex color code
- `opacity`: Number - opacity value (0-1)
- `x`: Number - x position (0-100%)
- `y`: Number - y position (0-100%)

### UI Components
- UInput for text input
- USlider for font size
- UColorPicker for color selection
- USlider for opacity
- UInput for x/y coordinates
- UButton to apply current settings

## 3. WatermarkPreview.vue

### Purpose
Display the image with applied watermarks in real-time.

### Props
- `images`: Array of image objects
- `watermarks`: Array of watermark configurations
- `is-processing`: Boolean indicating if processing is in progress

### Features
- Canvas-based rendering
- Real-time watermark preview
- Zoom and pan functionality
- Multiple image support
- Loading states
- Error handling for image processing

### UI Components
- UCard for preview container
- Canvas element for rendering
- ULoadingOverlay for processing states
- UButton for zoom controls

## 4. WatermarkManager.vue

### Purpose
Manage multiple watermarks on a single image.

### Props
- `watermarks`: Array of watermark configurations

### Events
- `add-watermark`: Emits when a new watermark is added
- `update-watermark`: Emits when a watermark is updated
- `remove-watermark`: Emits when a watermark is removed
- `apply-watermarks`: Emits when watermarks are applied

### Features
- List view of all watermarks
- Individual configuration for each watermark
- Add/remove watermark buttons
- Reorder watermarks
- Apply all button

### UI Components
- UList for watermark list
- UButton for actions
- UCard for each watermark item
- UDraggable for reordering