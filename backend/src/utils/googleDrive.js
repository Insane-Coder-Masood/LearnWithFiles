const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const uploadToGoogleDrive = async (filePath, fileName) => {
  try {
    console.log('Uploading to Google Drive using OAuth 2.0:', fileName);
    
    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
    
    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;
    console.log('Got access token');
    
    const fileMetadata = {
      name: fileName,
      mimeType: 'application/pdf',
    };
    
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    if (folderId) {
      fileMetadata.parents = [folderId];
    }
    
    const form = new FormData();
    form.append('metadata', JSON.stringify(fileMetadata), {
      contentType: 'application/json',
    });
    form.append('file', fs.createReadStream(filePath), {
      contentType: 'application/pdf',
      filename: fileName,
    });
    
    const uploadRes = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const fileId = uploadRes.data.id;
    console.log('File uploaded to Google Drive, ID:', fileId);
    
    // Make file public
    await axios.post(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        role: 'reader',
        type: 'anyone',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    console.log('File made public');
    
    const publicUrl = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    return { viewUrl: publicUrl, downloadUrl: downloadUrl };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
};

module.exports = { uploadToGoogleDrive };
