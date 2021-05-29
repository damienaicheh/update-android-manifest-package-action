# Update Android manifest package action

This action update the `package` and `android:label` for the `application` properties of the AndroidManifest.xml file for your Android projects.

## Inputs

### `android-manifest-path`

**Required** The relative path for the AndroidManifest.xml file.

### `package-name` 
  
**Required** The new package name for the application.

###  `app-name`
    
The new application label

###  `print-file`

Output the AndroidManifest.xml file in console before and after update.

## Usage

```yaml
- name: Update AndroidManifest.xml
  uses: damienaicheh/update-android-manifest-package-action@v1.0.0
  with:
    android-manifest-path: './path_to_your/AndroidManifest.xml'
    package-name: 'com.mynew.app'
    app-name: 'MyApp'
    print-file: true
```