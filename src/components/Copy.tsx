import classnames from 'classnames';
import { sleep } from 'openai/core.mjs';
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from '@radix-ui/react-icons';

interface IProps {
  content: string;
  className?: string;
}

export function Copy({ content, className }: IProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  async function handleCopy() {
    if (content) {
      await navigator.clipboard.writeText(content);
      setCopySuccess(true);
      await sleep(1500);
      setCopySuccess(false);
    }
  }

  return (
    <>
      {copySuccess ? (
        <CheckIcon className={classnames('w-5 h-5', className)} />
      ) : (
        <CopyIcon
          className={classnames('cursor-pointer w-5 h-5', className)}
          onClick={handleCopy}
        />
      )}
    </>
  );
}
