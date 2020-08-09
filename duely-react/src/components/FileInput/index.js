import React, { useState, useEffect } from 'react';
import useFormControl from 'hooks/useFormControl';
import Input from 'components/Input';
import { BsImage, BsFileEarmark } from 'react-icons/bs';
import './FileInput.css';
import { estimateImageColor, createClassName } from 'utils'; 

const FileInput = React.forwardRef(({ type = 'file', icon, accept, onChange, decoder, className, rules, required, previewAspectRatio, ...props }, ref) => {
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

  const { clear, validate, getValue } = useFormControl(ref);
  useEffect(() => {
    if (state.data !== undefined && validate) {
      validate();
    }
  }, [getValue, validate, state.data]);

  const processInput = e => {
    if (clear) clear();
    processFile(e.target.files?.[0]);
    if (onChange) onChange(e);
  };

  function processFile(file) {
    if (type === 'image') {
      ref.current.style.removeProperty('--url-image');
    }

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
      reader.onload = async () => {
        const dataUrl = reader.result;
        const color = await estimateImageColor(dataUrl)

        ref.current.style.setProperty('--url-image', `url('${dataUrl}')`);

        if (color) {
          ref.current.style.setProperty('--color-image', color);
        }

        setState(state => ({
          ...state,
          data: decoder ? decoder(dataUrl) : dataUrl,
          color,
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

  useEffect(() => {
    if (type === 'image') {
      ref.current.style.setProperty('--preview-aspect-ratio', previewAspectRatio ?? 1.0);
    }
  }, [ref, type, previewAspectRatio]);

  className = createClassName(className, 'file-input', type === 'image' && 'image-input', state.data && 'file-uploaded');

  return (
    <Input type="file" className={ className } accept={ accept } getValue={ () => state } rules={ rules } onChange={ processInput } { ...props } ref={ ref } icon={ icon } loading={ state.loading }>
      <span>{ state.file?.name }</span>
    </Input>
  );
});

export default FileInput;