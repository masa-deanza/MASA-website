/**
 * Contact Service - API & Network Integration
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqevlgbl';

/**
 * Submit form data to Formspree endpoint asynchronously
 * @param {HTMLFormElement} formElement
 * @param {HTMLElement} statusElement
 * @param {HTMLButtonElement} submitButton
 * @returns {Promise<boolean>}
 */
export async function submitContactMessage(formElement, statusElement, submitButton) {
  if (!formElement) return false;

  const originalBtnText = submitButton ? submitButton.innerHTML : '';
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<span>Sending Message...</span>';
  }

  if (statusElement) {
    statusElement.style.display = 'none';
    statusElement.className = 'form-status';
  }

  const formData = new FormData(formElement);

  try {
    const response = await fetch(formElement.action || FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      if (statusElement) {
        statusElement.textContent = '🎉 Thank you! Your message has been sent. An officer will reply to your email soon!';
        statusElement.classList.add('success');
        statusElement.style.display = 'block';
      }
      formElement.reset();
      return true;
    } else {
      const data = await response.json().catch(() => null);
      const errorMessage = data?.errors?.map(err => err.message).join(', ') 
        || 'Oops! There was a problem submitting your form. Please try again or DM us on Instagram.';
      
      if (statusElement) {
        statusElement.textContent = `⚠️ ${errorMessage}`;
        statusElement.classList.add('error');
        statusElement.style.display = 'block';
      }
      return false;
    }
  } catch (error) {
    if (statusElement) {
      statusElement.textContent = '⚠️ Network error. Please check your connection or contact us directly on Instagram @deanza.masa.';
      statusElement.classList.add('error');
      statusElement.style.display = 'block';
    }
    return false;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = originalBtnText;
    }
  }
}
