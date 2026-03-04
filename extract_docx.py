from docx import Document
import os
from PIL import Image
import io

doc_path = "docs/Los Tres Pilares.docx"
output_dir = "docs/extracted"

os.makedirs(output_dir, exist_ok=True)

doc = Document(doc_path)

print("=== TEXTO DEL DOCUMENTO ===\n")

for para in doc.paragraphs:
    text = para.text.strip()
    if text:
        print(text)

print("\n=== IMÁGENES EN EL DOCUMENTO ===\n")

image_count = 0
for rel in doc.part.rels.values():
    if "image" in rel.target_ref:
        image_count += 1
        image_blob = rel.target_part.blob
        image_ext = rel.target_part.content_type.split('/')[-1]
        
        image_path = os.path.join(output_dir, f"image_{image_count}.{image_ext}")
        with open(image_path, 'wb') as f:
            f.write(image_blob)
        print(f"Imagen guardada: {image_path}")

print(f"\nTotal de imágenes encontradas: {image_count}")
