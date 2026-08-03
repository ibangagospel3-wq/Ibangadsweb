/**
 * EmailJS Service Configuration
 * 
 * Replace the following placeholders with your EmailJS credentials:
 * 1. YOUR_PUBLIC_KEY - Get from EmailJS Dashboard > Account Settings > API Keys
 * 2. YOUR_SERVICE_ID - Get from EmailJS Dashboard > Email Services
 * 3. YOUR_TEMPLATE_ID - Get from EmailJS Dashboard > Email Templates
 */

class EmailService {
  constructor() {
    // Initialize EmailJS with your Public Key
    // emailjs.init('YOUR_PUBLIC_KEY');
    
    this.serviceId = 'YOUR_SERVICE_ID';
    this.contactTemplateId = 'YOUR_TEMPLATE_ID';
    this.newsletterTemplateId = 'YOUR_TEMPLATE_ID';
    this.isLoading = false;
  }

  /**
   * Send contact form submission
   * @param {Object} formData - Form data object
   * @returns {Promise}
   */
  async sendContactForm(formData) {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      this.showLoadingSpinner();

      const templateParams = {
        from_name: formData.fullName,
        from_email: formData.email,
        phone: formData.phone || 'Not provided',
        business_name: formData.businessName || 'Not provided',
        service_type: formData.serviceType || 'Not specified',
        budget: formData.budget || 'Not specified',
        project_details: formData.projectDetails,
        submission_date: new Date().toLocaleString(),
        to_email: 'ibangagospel3@gmail.com'
      };

      // Uncomment this when you have configured EmailJS credentials
      // const response = await emailjs.send(
      //   this.serviceId,
      //   this.contactTemplateId,
      //   templateParams
      // );

      // For testing without EmailJS configured
      console.log('Contact form would be sent:', templateParams);
      
      this.hideLoadingSpinner();
      this.showSuccessMessage('Thank you! Your message has been received. We\'ll contact you shortly.');
      return true;

    } catch (error) {
      this.hideLoadingSpinner();
      this.showErrorMessage('Failed to send message. Please try again or contact us directly.');
      console.error('EmailJS Error:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Send newsletter subscription
   * @param {string} email - Subscriber email
   * @returns {Promise}
   */
  async subscribeNewsletter(email) {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      this.showLoadingSpinner();

      const templateParams = {
        subscriber_email: email,
        subscription_date: new Date().toLocaleString(),
        to_email: 'ibangagospel3@gmail.com'
      };

      // Uncomment this when you have configured EmailJS credentials
      // const response = await emailjs.send(
      //   this.serviceId,
      //   this.newsletterTemplateId,
      //   templateParams
      // );

      // For testing without EmailJS configured
      console.log('Newsletter subscription would be sent:', templateParams);

      this.hideLoadingSpinner();
      this.showSuccessMessage('Thank you for subscribing to IBANGA ADS & WEB DEVELOPER.');
      return true;

    } catch (error) {
      this.hideLoadingSpinner();
      this.showErrorMessage('Failed to subscribe. Please try again.');
      console.error('EmailJS Error:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Show loading spinner
   */
  showLoadingSpinner() {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.id = 'loadingSpinner';
      spinner.className = 'email-loading-spinner';
      spinner.innerHTML = '<div class="spinner"></div><p>Sending...</p>';
      document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
  }

  /**
   * Hide loading spinner
   */
  hideLoadingSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
      spinner.style.display = 'none';
    }
  }

  /**
   * Show success message
   */
  showSuccessMessage(message) {
    this.showToast(message, 'success');
  }

  /**
   * Show error message
   */
  showErrorMessage(message) {
    this.showToast(message, 'error');
  }

  /**
   * Show toast notification
   */
  showToast(message, type = 'info') {
    let toastContainer = document.getElementById('toastContainer');
    
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toastContainer';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'}"></i>
        <span>${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
}

// Initialize the email service
const emailService = new EmailService();
