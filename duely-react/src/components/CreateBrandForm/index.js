import React, { useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import { mutate } from 'apollo';
import queries from 'apollo/queries';
import { BsGeo } from 'react-icons/bs';
import TextInput from 'components/TextInput';
import { subdomainFieldProps } from 'components/TextInput/presets';
import SelectInput from 'components/SelectInput';
import FileInput from 'components/FileInput';
import Button from 'components/Button';
import Link from 'components/Link';
import Form from 'components/Form';
import useModal from 'hooks/useModal';
import { countryByCode } from 'utils';

const CreateBrandForm = React.forwardRef(({ className, ...props }, ref) => {
  const [state, setState] = useState({ completed: undefined, error: undefined, loading: undefined });
  const countryCodesQuery = useQuery(queries.countryCodes.query);
  const countryCodes = queries.countryCodes
    .result(countryCodesQuery.data)
    ?.map(c => ({ value: c, element: countryByCode(c)?.name }))
    .sort((a, b) => (a.element ?? a.value).localeCompare(b.element ?? b.value));

  const hideTosRef = useRef();
  const showTosModal = useModal(
    <div className="flex column gap-4 w-panel">
      <h3>Service Agreement</h3>
      <p>Payment processing services for agencies on duely are provided by Stripe and are subject to the <Link className="f-b" target="_blank" rel="noopener noreferrer" to="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</Link>, which includes the <Link className="f-b" target="_blank" rel="noopener noreferrer" href="https://stripe.com/legal">Stripe Terms of Service</Link> (collectively, the “Stripe Services Agreement”). By agreeing to this agreement or continuing to operate as a agency on duely, you agree to be bound by the Stripe Services Agreement, as the same may be modified by Stripe from time to time. As a condition of duely enabling payment processing services through Stripe, you agree to provide duely accurate and complete information about you and your business, and you authorize duely to share it and transaction information related to your use of the payment processing services provided by Stripe.</p>
      <Button onClick={ () => hideTosRef.current() }>OK</Button>
    </div>,
    { hideModalRef: hideTosRef }
  );

  const handleSubmit = async (data) => {
    try {
      const { name, subdomain, countryCode } = data;
      const access_token = localStorage.getItem('user-jwt');
      const returnUrl = process.env.NODE_ENV === 'production'
        ? `https://${subdomain}.duely.app/dashboard?access_token=${access_token}`
        : `${window.location.origin}/dashboard?subdomain=${subdomain}`;

      setState({ loading: true });
      const result = await mutate('createAgency', { name, subdomain, countryCode, returnUrl });

      if (result.success) {
        try {
          await mutate('editImage', { agencyUuid: result.agency.uuid, imageName: 'logo', imageData: data.imageLogo.data, imageColor: data.imageLogo.color });
        } catch {
          // TODO
        }

        setState({ 
          loading: false,
          completed: (
            <div className="flex gap-4 column center-h">
              <span className="success f-b">Your brand dashboard is almost ready.</span>
              <Button type="button" link={{ to: result.stripeVerificationUrl }} onClick={ () => setState({ completed: <p>Redirecting to <span className="f-b">Stripe</span>...</p> }) } filled color="primary" >Verify account on Stripe</Button>
            </div>
          )
        });

      } else {
        setState({ error: result.message });
        setTimeout(() => setState({ loading: false }), 4000);
      }

    } catch (error) {
      setState({ error: error.message });
      setTimeout(() => setState({ loading: false }), 4000);
    }
  }

  className = Array.from(new Set(((className ?? '') + ' w-form').split(' '))).join(' ');

  return (
    <Form className={ className } handleSubmit={ handleSubmit } areaWidth="60ch" completed={ state.completed } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Create brand</h2>
      <TextInput name="name" label="Brand name" type="text" autoFocus required rules={[v => (v && v.length <= 70) || 'Brand name must be at most 70 characters']} />
      <TextInput name="subdomain" hint="Your agency will have a subdomain for duely.app" { ...subdomainFieldProps } />
      <SelectInput name="countryCode" label="Country" icon={ <BsGeo /> } options={ countryCodes } loading={ countryCodesQuery.loading } required />
      <FileInput name="imageLogo" label="Logo image" type="image" hint="For logo, use image with aspect ratio 1:1. Prefer .svg format." required />
      <p className="f-2 background color-l1n color-s1n mt-label-text">
        By creating an agency on duely, you agree to our <Link className="f-b" onClick={ showTosModal }>Services Agreement</Link> and the <Link className="f-b" target="_blank" rel="noopener noreferrer" to="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</Link>.
      </p>
      <Button className="mt-label-text" areaWidth="40ch" prominent filled color="primary" loading={ state.loading } error={ state.error }>Continue</Button>
    </Form>
  );
});

export default CreateBrandForm;
