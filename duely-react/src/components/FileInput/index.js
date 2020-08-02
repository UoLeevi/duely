import React, { useState } from 'react';
import Input from 'components/Input';
import { BsImage, BsFileEarmark } from 'react-icons/bs';
import './FileInput.css';

const FileInput = React.forwardRef(({ type = 'file', icon, accept, onChange, decoder, className, rules, required, ...props }, ref) => {
  const [state, setState] = useState({
    file: undefined,
    data: undefined,
    loading: false,
    error: undefined
  });

  rules = [
    state => state.error,
    state => !required || state.file || 'File is required',
    ...(rules ?? [])
  ];

  icon = icon ?? (
    type === 'image'
      ? <BsImage />
      : <BsFileEarmark />
  );

  accept = accept ?? (
    type === 'image'
    ? 'image/*'
    : undefined
  );

  const processInput = e => {
    processFile(e.target.files?.[0]);
    if (onChange) onChange(e);
  };

  function processFile(file) {
    if (!file) {
      setState({
        file,
        data: undefined,
        loading: false,
        error: undefined
      });
      return;
    }

    setState({
      file,
      data: undefined,
      loading: true,
      error: undefined
    });

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setState(state => ({
          ...state,
          data: decoder ? decoder(reader.result) : reader.result,
          loading: false,
          error: undefined
        }));
      };
      reader.onerror = err => {
        setState(state => ({
          ...state,
          data: undefined,
          loading: false,
          error: err.message
        }));
      };
    } catch (err) {
      setState(state => ({
        ...state,
        data: undefined,
        loading: false,
        error: err.message
      }));
    }
  }

  console.log(state);
  className = Array.from(new Set(((className ?? '') + ' file-input').split(' '))).join(' ');

  return (
    <Input type="file" className={ className } accept={ accept } getValue={ () => state } rules={ rules } onChange={ processInput } { ...props } ref={ ref } icon={ icon } loading={ state.loading }>
      <span>{ state.file?.name }</span>
    </Input>
  );
});

export default FileInput;
