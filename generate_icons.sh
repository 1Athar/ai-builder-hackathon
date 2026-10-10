#!/bin/bash

IQOO="/Users/soham/.gemini/antigravity-ide/brain/f1d47a18-f58b-4dd1-9959-69caa236ac61/iqooistant_icon_1791617670731.jpg"
CHROME="/Users/soham/.gemini/antigravity-ide/brain/f1d47a18-f58b-4dd1-9959-69caa236ac61/chromepe_icon_1791617689661.jpg"

IQOO_RES="/Users/soham/Downloads/paytm-hacky/Iqooistant/android/app/src/main/res"
CHROME_RES="/Users/soham/Downloads/paytm-hacky/ChromePeApp/android/app/src/main/res"

folders=("mipmap-mdpi" "mipmap-hdpi" "mipmap-xhdpi" "mipmap-xxhdpi" "mipmap-xxxhdpi")
sizes=(48 72 96 144 192)

for i in "${!folders[@]}"; do
  folder="${folders[$i]}"
  size="${sizes[$i]}"
  
  target_dir="$IQOO_RES/$folder"
  sips -z $size $size -s format png "$IQOO" --out "$target_dir/ic_launcher.png"
  sips -z $size $size -s format png "$IQOO" --out "$target_dir/ic_launcher_round.png"
  
  target_dir2="$CHROME_RES/$folder"
  sips -z $size $size -s format png "$CHROME" --out "$target_dir2/ic_launcher.png"
  sips -z $size $size -s format png "$CHROME" --out "$target_dir2/ic_launcher_round.png"
done

