export default function setFormFocus($input: HTMLInputElement, targetIndex: number) {
  const $form = $input.form;
  const targetClassNames = $input.classList.value;

  const $target = $form?.getElementsByClassName(targetClassNames)[targetIndex] as HTMLInputElement;

  if (!$target) {
    return;
  }

  $target.focus();
}
