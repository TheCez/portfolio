import PyPDF2

# Open the PDF file
pdf_file = open('Resume_Ajay_Chodankar.pdf', 'rb')
pdf_reader = PyPDF2.PdfReader(pdf_file)

# Extract text from all pages
full_text = ""
for page in pdf_reader.pages:
    full_text += page.extract_text() + "\n\n"

# Save to text file
with open('resume_text.txt', 'w', encoding='utf-8') as f:
    f.write(full_text)

print("Text extracted successfully!")
pdf_file.close()
