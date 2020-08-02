import React, { useRef } from 'react';
import TextInput from 'components/TextInput';
import { subdomainFieldProps } from 'components/TextInput/presets';
import FileInput from 'components/FileInput';
import Button from 'components/Button';
import Link from 'components/Link';
import Form from 'components/Form';
import useModal from 'hooks/useModal';

const CreateBrandForm = React.forwardRef(({ className, ...props }, ref) => {
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
    console.log(data);
  }

  className = Array.from(new Set(((className ?? '') + ' w-form').split(' '))).join(' ');

  return (
    <Form className={ className } handleSubmit={ handleSubmit } areaWidth="60ch" { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Create brand</h2>
      <TextInput name="name" label="Brand name" type="text" autoFocus required rules={[v => (v && v.length <= 70) || 'Brand name must be at most 70 characters']} />
      <TextInput name="subdomain" hint="Your agency will have a subdomain for duely.app" { ...subdomainFieldProps } />
      <FileInput name="imageLogo" label="Logo image" type="image" hint="For logo, use image with aspect ratio 1:1. Prefer .svg format." required />
      <p className="f-2 background color-l1n color-s1n mt-label-text">
        By creating an agency on duely, you agree to our <Link className="f-b" onClick={ showTosModal }>Services Agreement</Link> and the <Link className="f-b" target="_blank" rel="noopener noreferrer" to="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</Link>.
      </p>
      <Button className="mt-label-text" areaWidth="40ch" prominent filled color="primary">Continue</Button>
    </Form>
  );
});

export default CreateBrandForm;
