import React from 'react';

import { Table } from '.';
import { Util } from '../../util';

export default {
  title: 'Tables/Table',
  component: Table,
  argTypes: {},
};

const Template = (args) => {
  return <Table {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  headers: [
    'Event',
    'Info',
    'Date'
  ],
  rows: [
    {
      event: 'Sale',
      info: 'Lili has bought Keyword research',
      date: Util.formatDate(new Date())
    },
    {
      event: 'Sale',
      info: 'Leevi has bought Keyword research',
      date: Util.formatDate(new Date())
    },
    {
      event: 'File upload',
      info: 'Leevi has shared a file Content-brief.txt',
      date: Util.formatDate(new Date())
    },
  ],
  columns: [
    // event
    item => (
      <div className="text-sm font-semibold">{item.event}</div>
    ),

    // info
    item => (
      <div className="text-sm">{item.info}</div>
    ),

    // date
    item => (
      <div className="text-sm">{item.date}</div>
    ),
  ]
};

export const Loading = Template.bind({});
Loading.args = {
  headers: [
    'Event',
    'Info',
    'Date'
  ],
  loading: true
};

export const Error = Template.bind({});
Error.args = {
  headers: [
    'Event',
    'Info',
    'Date'
  ],
  error: true
};
