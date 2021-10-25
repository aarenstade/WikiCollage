from PIL import Image, ImageDraw, ImageFont

for i in range(100):
    img = Image.new('RGB', (1000,1000), color='blue')
    dr = ImageDraw.Draw(img)
    dr.rectangle([(20, 20), (1000 - 20, 1000 - 20)], fill='black')
    fnt = ImageFont.truetype('Arial Bold.ttf', 150)
    dr.text((450,400), str(i + 1), fill='white', font=fnt)
    img.save(str(i + 1) + '.jpg')
    