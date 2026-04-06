# Utility Functions Design

## imageProcessor.js

### Purpose
Provide core image processing functionality for watermarking operations.

### Functions

#### loadImage(imageUrl)
- **Description**: Load an image from URL or file
- **Parameters**: 
  - `imageUrl`: String - URL or file object of the image
- **Returns**: Promise that resolves to HTMLImageElement
- **Features**: 
  - Handle both file uploads and URLs
  - Error handling for invalid images
  - Loading state management

#### drawTextWatermark(canvas, text, options)
- **Description**: Draw text watermark on canvas
- **Parameters**:
  - `canvas`: HTMLCanvasElement - target canvas
  - `text`: String - text to draw
  - `options`: Object - watermark configuration
    - `fontSize`: Number - font size in pixels
    - `color`: String - text color
    - `opacity`: Number - text opacity (0-1)
    - `x`: Number - x position (0-100%)
    - `y`: Number - y position (0-100%)
- **Returns**: Void
- **Features**:
  - Text rendering with specified font
  - Color and opacity support
  - Positioning based on percentage coordinates
  - Text alignment options

#### applyWatermarks(image, watermarks)
- **Description**: Apply multiple watermarks to an image
- **Parameters**:
  - `image`: HTMLImageElement - source image
  - `watermarks`: Array - array of watermark configurations
- **Returns**: Promise that resolves to HTMLCanvasElement
- **Features**:
  - Sequential watermark application
  - Layer management
  - Positioning and styling for each watermark
  - Performance optimization

#### exportImage(canvas, format, quality)
- **Description**: Export canvas as image file
- **Parameters**:
  - `canvas`: HTMLCanvasElement - source canvas
  - `format`: String - export format ('png' or 'jpeg')
  - `quality`: Number - quality for jpeg (0-1)
- **Returns**: Blob or Data URL
- **Features**:
  - Multiple format support
  - Quality control for JPEG
  - Download functionality

#### createWatermarkCanvas(image, watermarks)
- **Description**: Create a canvas with watermarks applied
- **Parameters**:
  - `image`: HTMLImageElement - source image
  - `watermarks`: Array - array of watermark configurations
- **Returns**: Promise that resolves to HTMLCanvasElement
- **Features**:
  - Canvas setup with correct dimensions
  - Watermark application
  - Return canvas for further processing

### Performance Considerations
- Canvas optimization for large images
- Memory management for multiple images
- Asynchronous processing to prevent UI blocking
- Caching for frequently used operations

### Error Handling
- Invalid image formats
- Canvas rendering errors
- Memory limitations
- User input validation