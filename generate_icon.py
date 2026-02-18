from PIL import Image
import os

def make_square(image_path, output_path, fill_color=(0, 0, 0, 255)):
    try:
        print(f"Processing {image_path}...")
        if not os.path.exists(image_path):
            print(f"Error: Source image not found at {image_path}")
            return

        img = Image.open(image_path)
        img = img.convert("RGBA")
        width, height = img.size
        print(f"Original size: {width}x{height}")
        
        new_size = max(width, height)
        # Create new image with black background
        new_img = Image.new("RGBA", (new_size, new_size), fill_color)
        
        # Calculate position to center
        x = (new_size - width) // 2
        y = (new_size - height) // 2
        
        # Paste original image in center
        # If original has transparency, use it as mask
        new_img.paste(img, (x, y), img)
        
        new_img.save(output_path)
        print(f"Successfully created square icon at {output_path}")
        print(f"New size: {new_size}x{new_size}")
        
    except Exception as e:
        print(f"Error processing image: {e}")

# Paths
logo_path = r"c:\perfume\images\logo.png"
icon_path = r"c:\perfume\images\icon.png"

# Execute
make_square(logo_path, icon_path)
