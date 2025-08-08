import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

const TermsScreen: React.FC<Props> = () => {
const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 16px;
          max-width: 100%;
        }
        h2 {
          color: #000;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        h3 {
          color: #444;
          margin-top: 20px;
        }
        a {
          color: #0066cc;
          text-decoration: none;
        }
        strong {
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <h2>Terms and Conditions</h2>
      <p><em>Last Updated: ${new Date().toLocaleDateString()}</em></p>

      <p>By using this app ("the App"), you agree to the following terms and conditions. If you do not agree, please do not use the App.</p>

      <h3>1. No Warranty</h3>
      <p>The App is provided <strong>"as is"</strong> without any warranties, express or implied. We do not guarantee that the App will be error-free, uninterrupted, or meet your specific requirements. Use of the App is at your own risk.</p>

      <h3>2. No Liability</h3>
      <p>To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the App. This includes, but is not limited to, data loss, device malfunction, or any other issues resulting from App usage.</p>

      <h3>3. No Data Retention</h3>
      <p>The App does not store, collect, or retain any personal data, usage data, or other information. All processing occurs locally on your device, and no data is transmitted to or stored by us.</p>

      <h3>4. Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the updated terms.</p>

      <h3>5. Governing Law</h3>
      <p>These terms shall be governed by and construed in accordance with the laws of <strong>Australia</strong>, without regard to its conflict of law provisions.</p>

      <p><strong>By using the App, you acknowledge that you have read, understood, and agreed to these terms.</strong></p>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 80
  },
  webview: {
    flex: 1,
  },
});
export default TermsScreen;