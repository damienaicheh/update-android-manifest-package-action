import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as xml2js from 'xml2js';

process.on('unhandledRejection', handleError)
main().catch(handleError)

async function main(): Promise<void> {
    try {
        let printFile = getBooleanInput('print-file');
        let androidManifestPath = core.getInput('android-manifest-path');

        if (!fs.existsSync(androidManifestPath)) {
            core.setFailed(`The file path for the AndroidManifest.xml does not exist or is not found: ${androidManifestPath}`);
            process.exit(1);
        }

        let packageName = core.getInput('package-name');

        if (!packageName) {
            core.setFailed(`Package name has no value: ${packageName}`);
            process.exit(1);
        }

        let appName: string = core.getInput('app-name');

        if (printFile) {
            core.info('Before update:');
            await exec.exec('cat', [androidManifestPath]);
        }

        fs.chmodSync(androidManifestPath, "600");

        await fs.readFile(androidManifestPath, "utf-8", (err, data) => {
            if (err) {
                throw err;
            }

            // convert XML data to JSON object
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    throw err;
                }

                result.manifest['$'].package = packageName;

                if (appName) {
                    result.manifest.application[0]['$']['android:label'] = appName;
                }

                // convert JSON object to XML
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(result);

                // write updated XML string to a file
                fs.writeFile(androidManifestPath, xml, (err) => {
                    if (err) {
                        throw err;
                    }
                });

            });
        });

        if (printFile) {
            core.info('After update:');
            await exec.exec('cat', [androidManifestPath]);
        }

        core.info(`AndroidManifest.xml updated successfully`);
    } catch (error) {
        core.setFailed(error.message);
    }
}

function handleError(err: any): void {
    console.error(err)
    core.setFailed(`Unhandled error: ${err}`)
}

function getBooleanInput(inputName: string, defaultValue: boolean = false): boolean {
    return (core.getInput(inputName) || String(defaultValue)).toUpperCase() === 'TRUE';
}