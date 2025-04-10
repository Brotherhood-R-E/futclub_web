const fs = require('fs');

const filesToFix = [
    'src-capacitor/node_modules/@capacitor/android/capacitor/build.gradle',
    'src-capacitor/node_modules/@capacitor/app/android/build.gradle'
];

filesToFix.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        content = content.replace(/JavaVersion.VERSION_21/g, 'JavaVersion.VERSION_17');
        fs.writeFileSync(file, content);
        console.log(`✔️ Corrigido: ${file}`);
    }
});
