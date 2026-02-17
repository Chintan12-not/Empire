from PIL import Image
import os

def make_square(image_path, output_path, fill_color=(0, 0, 0, 0)):
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        width, height = img.size
        
        new_size = max(width, height)
        new_img = Image.new("RGBA", (new_size, new_size), fill_color)
        
        # Calculate position to center
        x = (new_size - width) // 2
        y = (new_size - height) // 2
        
        new_img.paste(img, (x, y), img)
        new_img.save(output_path)
        print(f"Successfully created square icon at {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")

# Paths
logo_path = r"c:\perfume\images\logo.png"
icon_path = r"c:\perfume\images\icon.png"

# Use black background because the user wants "black background"
# But wait, if the original logo is transparent, maybe black is safer?
# The user's prompt request was "black square background".
# So fill_color should be black (0, 0, 0, 255)
make_square(logo_path, icon_path, fill_color=(0, 0, 0, 255))
