var Webflow = Webflow || [];

const i18n_EMPTY_ERROR_KEY = 'input-error-empty';
const i18n_NO_VALID_ERROR_KEY = 'input-error-no-valid';
const i18n_BUTTON_WAIT_KEY = 'button-wait-message';
const i18n_CHECKBOX_ERROR_KEY = 'checkbox-error-required';

Webflow.push(function () {
  $(document).off('submit');
  const $forms = $('.email-capture-form');

  $forms.each(function (i, el) {
    const $formContainer = $(el);
    const $form = $('form', $formContainer);
    const $input = $('[type=email]', $form);
    const inputElement = $input[0];
    const $checkbox = $('[type=checkbox]', $form);
    const $button = $('[type=submit]', $form);
    const emailPosition = $form.attr('data-email-position');
    const buttonInitialText = $button.val();
    const $emailErrorContainer = $('.error-input-container', $form);
    const $emailCheckboxErrorContainer = $('.error-checkbox-container', $form);

    $form.submit(async function (e) {
      e.preventDefault();
      // Set waiting text
      const locale = $.i18n().locale;
      const buttonWaitingText =
        window.dictionary[`${locale}`][`${i18n_BUTTON_WAIT_KEY}`];

      if (buttonWaitingText) {
        $button.val(buttonWaitingText);
      }

      const userData = await sendDataToBraze($form, $input.val());

      if (userData) {
        $form
          .hide()
          .siblings('.w-form-done')
          .show()
          .siblings('.w-form-fail')
          .hide();

        const $fullWidthCopy = $('#full-width-copy-2');

        if ($fullWidthCopy.length) {
          $('#full-width-copy-2').hide();
        }

        $button.val(buttonInitialText);

        /* SEGMENT ANALYTICS EVENT - EMAIL CAPTURE SUBMISSION SUCCESS */
        setSubscriptionSuccessfulEvent(
          $button.val(),
          $formContainer.attr('id'),
          emailPosition,
          userData.groupId,
          userData.uuid
        );
      } else {
        $form
          .hide()
          .siblings('.w-form-done')
          .hide()
          .siblings('.w-form-fail')
          .show();
      }
    });

    $input.on('input', (e) => {
      e.preventDefault();
      $emailErrorContainer.hide();
      $emailCheckboxErrorContainer.hide();
    });

    $input.on('invalid', function (e) {
      e.preventDefault();
      validateEmailInput(inputElement, $emailErrorContainer);
    });

    if ($checkbox) {
      $checkbox.on('invalid', (e) => {
        e.preventDefault();
        const locale = $.i18n().locale;
        if (inputElement.validity.valid) {
          $emailCheckboxErrorContainer.show();
          const $errorMessage = $(
            '.input-error-message',
            $emailCheckboxErrorContainer
          );
          $errorMessage.text(
            window.dictionary[`${locale}`][`${i18n_CHECKBOX_ERROR_KEY}`]
          );
        }
      });

      $checkbox.on('change', (e) => {
        e.preventDefault();
        $emailErrorContainer.hide();
        $emailCheckboxErrorContainer.hide();
      });
    }

    /* SEGMENT ANALYTICS EVENT - INPUT SELECTION */
    $input.click(function () {
      setEmailCaptureEventSegment(
        'Input Text Selected',
        $input.attr('placeholder'),
        $formContainer.attr('id')
      );
    });

    /* SEGMENT ANALYTICS EVENT - BUTTON CLICK */
    $button.click(function () {
      setEmailCaptureEventSegment(
        'Register Button Clicked',
        $button.val(),
        $formContainer.attr('id')
      );
    });
  });
});

const setEmailCaptureEventSegment = (
  eventName,
  elementText,
  formContainerId
) => {
  const properties = {
    ui_event_version: '1.0', //Always pass this value
    ui_event_name: eventName,
    screen_id: window.location.pathname, // Send the URL Path
    screen_title: document.title, //Send the page title
    screen_type: 'mlp_page', //Always stays as "mlp_page"

    ui_carousel_id: 'w-node-b22e1d77-8a84-8d0f-4bd2-266ac83a7e9f-c83a7e9b', //Pass always this id
    ui_carousel_title: 'Newsletter Subscription', //Always pass this value

    ui_content_type: 'Promo', //Always stays as "Promo"
    ui_content_id: formContainerId, //Pass the id of the <div>
    ui_content_title: elementText, //Pass the field text
  };

  analytics.track('User Interacted', properties, SEGMENT_OPTIONS);
};

const setSubscriptionSuccessfulEvent = (
  elementText,
  formContainerId,
  emailPosition,
  groupId,
  userId
) => {
  const properties = {
    ui_event_name: 'Registration Successful',
    ui_event_version: '2.0', //Always pass this value
    screen_id: window.location.pathname, // Send the URL Path
    screen_title: document.title, //Send the page title
    screen_type: 'mlp_page', //Always stays as "mlp_page"
    event_category: 'Email Subscription',
    event_label: emailPosition,
  };

  analytics.track('User Interacted', properties, SEGMENT_OPTIONS);
};

const validateEmailInput = (emailInput, $emailErrorContainer) => {
  const locale = $.i18n().locale;
  const $errorMessage = $('.input-error-message', $emailErrorContainer);

  if (emailInput.value === '') {
    $emailErrorContainer.show();
    $errorMessage.attr('data-i18n', i18n_EMPTY_ERROR_KEY);
    $errorMessage.text(
      window.dictionary[`${locale}`][`${i18n_EMPTY_ERROR_KEY}`]
    );
  } else if (emailInput.validity.typeMismatch) {
    $emailErrorContainer.show();
    $errorMessage.text(
      window.dictionary[`${locale}`][`${i18n_NO_VALID_ERROR_KEY}`]
    );
    $errorMessage.attr('data-i18n', i18n_NO_VALID_ERROR_KEY);
  } else {
    $emailErrorContainer.hide();
  }
};

const sendDataToBraze = async ($form, userEmail) => {
  try {
    const userData = await sendBrazeTrackUserRequest(userEmail);
    return userData;
  } catch (error) {
    return null;
  }
};

const sendBrazeTrackUserRequest = async (userEmail) => {
  const requestData = {
    email: userEmail,
  };
  const response = await fetch(
    'https://us-east1-st-vix-ott-prd.cloudfunctions.net/client-utility/user-enrollment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    }
  );

  const data = await response.json();

  return data;
};
