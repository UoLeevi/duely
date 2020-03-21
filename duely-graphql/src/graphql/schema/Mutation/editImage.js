import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function editImage(obj, { agencyUuid, imageName, imageData, imageColor }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  // validate image argument

  if (!validator.isDataURI(imageData))
  return {
    success: false,
    message: `Argument 'imageData' has invalid format. Data URL with base64 encoded data is expected.`,
    type: 'EditImageResult'
  };

  // validate color argument

  if (!validator.isHexColor(imageColor))
  return {
    success: false,
    message: `Argument 'imageColor' has invalid format. Hexadecimal color code expected.`,
    type: 'EditImageResult'
  };

  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    // create or update theme on database
    const res = await client.query('SELECT * FROM operation_.edit_image_($1::uuid, $2::text, $3::text, $4::text)', [agencyUuid, imageName, imageData, imageColor]);
    const image = res.rows[0];

    // success
    return {
      success: true,
      image,
      type: 'EditImageResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'EditImageResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};
