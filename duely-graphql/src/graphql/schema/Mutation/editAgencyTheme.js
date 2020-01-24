import { pool } from '../../../db';
import { AuthenticationError } from 'apollo-server-core';
import validator from 'validator';

export default async function editAgencyTheme(obj, { agencyUuid, imageLogo, imageHero, colorPrimary, colorSecondary, colorAccent, colorError, colorSuccess }, context, info) {
  if (!context.jwt)
    throw new AuthenticationError('Unauthorized');

  // validate image arguments

  if (!validator.isBase64(imageLogo))
  return {
    success: false,
    message: `Argument 'imageLogo' has invalid format. Images should be base64 encoded.`,
    type: 'EditAgencyThemeResult'
  };

  if (!validator.isBase64(imageHero))
  return {
    success: false,
    message: `Argument 'imageHero' has invalid format. Images should be base64 encoded.`,
    type: 'EditAgencyThemeResult'
  };

  // validate color arguments

  if (!validator.isHexColor(colorPrimary))
  return {
    success: false,
    message: `Argument 'colorPrimary' has invalid format. Hexadecimal color code expected.`,
    type: 'EditAgencyThemeResult'
  };

  if (!validator.isHexColor(colorSecondary))
  return {
    success: false,
    message: `Argument 'colorSecondary' has invalid format. Hexadecimal color code expected.`,
    type: 'EditAgencyThemeResult'
  };

  if (!validator.isHexColor(colorAccent))
  return {
    success: false,
    message: `Argument 'colorAccent' has invalid format. Hexadecimal color code expected.`,
    type: 'EditAgencyThemeResult'
  };

  if (!validator.isHexColor(colorError))
  return {
    success: false,
    message: `Argument 'colorError' has invalid format. Hexadecimal color code expected.`,
    type: 'EditAgencyThemeResult'
  };

  if (!validator.isHexColor(colorSuccess))
  return {
    success: false,
    message: `Argument 'colorSuccess' has invalid format. Hexadecimal color code expected.`,
    type: 'EditAgencyThemeResult'
  };


  const client = await pool.connect();
  try {
    await client.query('SELECT operation_.begin_session_($1::text, $2::text)', [context.jwt, context.ip]);

    // create or update theme on database
    const res = await client.query('SELECT uuid_ FROM operation_.edit_agency_theme_($1::uuid, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text)', [agencyUuid, imageLogo, imageHero, colorPrimary, colorSecondary, colorAccent, colorError, colorSuccess]);
    const themeUuid = res.rows[0].uuid_;

    // success
    return {
      success: true,
      themeUuid,
      type: 'EditAgencyThemeResult'
    };

  } catch (error) {
    return {
      // error
      success: false,
      message: error.message,
      type: 'EditAgencyThemeResult'
    };
  }
  finally {
    await client.query('SELECT operation_.end_session_()');
    client.release();
  }
};