import { Form } from "@inertiajs/react";
import { forwardRef, useState, useRef } from "react";
import { flushSync } from "react-dom";

export let SaveButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      // this makes it so the button takes focus on clicks in safari I can't
      // remember if this is the proper workaround or not, it's been a while!
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button#clicking_and_focus
      // https://bugs.webkit.org/show_bug.cgi?id=22261
      tabIndex={0}
      {...props}
      className="text-sm rounded-lg text-left p-2 font-medium text-white bg-brand-blue"
    />
  );
});

export let CancelButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>((props, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      tabIndex={0}
      {...props}
      className="text-sm rounded-lg text-left p-2 font-medium hover:bg-slate-200 focus:bg-slate-200"
    />
  );
});

export function EditableText({
  action,
  fieldName,
  value,
  inputClassName,
  inputLabel,
  buttonClassName,
  buttonLabel,
}: {
  action: string;
  fieldName: string;
  value: string;
  inputClassName: string;
  inputLabel: string;
  buttonClassName: string;
  buttonLabel: string;
}) {
  let [edit, setEdit] = useState(false);
  let [currentValue, setCurrentValue] = useState(value);
  let inputRef = useRef<HTMLInputElement>(null);
  let buttonRef = useRef<HTMLButtonElement>(null);

  value = currentValue;

  return edit ? (
    <Form
      method="put"
      action={action}
      showProgress={false}
      onStart={({ data }) => {
        setCurrentValue(data[fieldName])
        flushSync(() => {
          setEdit(false);
        });
        buttonRef.current?.focus();
      }}
    >
      {({ submit }) => (
        <input
          required
          ref={inputRef}
          type="text"
          aria-label={inputLabel}
          name={fieldName}
          defaultValue={value}
          className={inputClassName}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              flushSync(() => {
                setEdit(false);
              });
              buttonRef.current?.focus();
            }
          }}
          onBlur={() => {
            if (
              inputRef.current?.value !== value &&
              inputRef.current?.value.trim() !== ""
            ) {
              submit()
            }
            setEdit(false);
          }}
        />
      )}
    </Form>
  ) : (
    <button
      aria-label={buttonLabel}
      type="button"
      ref={buttonRef}
      onClick={() => {
        flushSync(() => {
          setEdit(true);
        });
        inputRef.current?.select();
      }}
      className={buttonClassName}
    >
      {value || <span className="text-slate-400 italic">Edit</span>}
    </button>
  );
}
