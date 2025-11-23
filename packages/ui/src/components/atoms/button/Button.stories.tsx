import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import { Button, type ButtonProps } from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
} as Meta<ButtonProps>;

const Template: StoryFn<ButtonProps> = (args) => <Button {...args} />;

export const Primary: StoryFn<ButtonProps> = Template.bind({});
Primary.args = {
};
