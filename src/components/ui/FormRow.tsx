import styled from 'styled-components';
import type { ReactElement, ReactNode } from 'react';
import type { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

const StyledFormRow = styled.div`
   display: grid;
   gap: 0.6rem;
   width: 100%;
   padding: 0.85rem 0;

   &:first-child {
      padding-top: 0;
   }

   &:last-child {
      padding-bottom: 0;
   }

   &:not(:last-child) {
      border-bottom: 1px solid var(--border);
   }

   &:has(button) {
      display: flex;
      justify-content: flex-end;
      gap: 1.2rem;
      flex-wrap: wrap;
   }

   @media (max-width: 640px) {
      padding: 0.7rem 0;

      &:not(:last-child) {
         border-bottom: 0;
      }

      &:has(button) {
         justify-content: stretch;
         gap: 0.75rem;
      }
   }

   & > * {
      min-width: 0;
   }

   input,
   textarea,
   select {
      width: 100%;
   }
`;

const Label = styled.label`
   font-weight: 500;
`;

const Error = styled.span`
   font-size: 0.875rem;
   color: var(--destructive);
`;

export default function FormRow({
   label,
   error,
   children,
}: {
   label?: string;
   error?:
      | string
      | FieldError
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      | Merge<FieldError, FieldErrorsImpl<any>>
      | undefined;
   children?: ReactElement | ReactNode;
}) {
   return (
      <StyledFormRow>
         {label && (
            <Label
               htmlFor={(children as ReactElement<{ id: string }>).props?.id}
            >
               {label}
            </Label>
         )}
         {children}
         {error && (
            <Error>
               {String(
                  typeof error === 'string'
                     ? error
                     : error?.message || 'An error occurred',
               )}
            </Error>
         )}
      </StyledFormRow>
   );
}
