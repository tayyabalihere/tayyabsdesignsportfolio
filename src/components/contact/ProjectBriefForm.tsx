import React, { useState } from 'react';
import { Send, Upload, CheckCircle2, AlertCircle, Loader2, MessageSquare, Calendar } from 'lucide-react';
import type { ProjectBriefFormData } from '../../types';
import { useCMS } from '../../context/CMSContext';

export const ProjectBriefForm: React.FC = () => {
  const { settings } = useCMS();

  const [formData, setFormData] = useState<ProjectBriefFormData>({
    fullName: '',
    brandName: '',
    email: '',
    whatsappNumber: '',
    country: '',
    timezone: '',
    projectType: 'New Clothing Line',
    clothingCategory: 'Streetwear',
    requiredServices: ['Streetwear Graphic Design'],
    garmentTypes: ['Hoodies', 'T-shirts'],
    numberOfDesigns: '3-5 Designs',
    budgetRange: '$1,000 - $2,500',
    deliveryTimeline: '2-3 Weeks',
    projectDescription: '',
    referenceLinks: '',
    fileUploadNames: [],
    preferredContact: 'whatsapp',
    privacyConsent: false,
  });

  const [honeypot, setHoneypot] = useState('');
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const exists = prev.requiredServices.includes(service);
      const updated = exists
        ? prev.requiredServices.filter((s) => s !== service)
        : [...prev.requiredServices, service];
      return { ...prev, requiredServices: updated };
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) => file.name);
      setFormData((prev) => ({
        ...prev,
        fileUploadNames: [...prev.fileUploadNames, ...filesArray],
      }));
    }
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.';
    if (!formData.brandName.trim()) return 'Please enter your brand or company name.';
    if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid email address.';
    return null;
  };

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMsg(err);
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (honeypot.trim() !== '') return;

    const err = validateStep1();
    if (err) {
      setErrorMsg(err);
      setStep(1);
      return;
    }

    if (!formData.projectDescription.trim()) {
      setErrorMsg('Please provide a brief project description.');
      return;
    }

    if (!formData.privacyConsent) {
      setErrorMsg('Please accept the privacy consent to proceed.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmittedSuccess(true);
    }, 1200);
  };

  if (submittedSuccess) {
    return (
      <div className="bg-[#171614] border border-[#F2EDE4]/40 p-8 md:p-12 rounded-2xl text-center space-y-6 animate-fade-in-slide">
        <div className="w-16 h-16 bg-[#F2EDE4]/10 border border-[#F2EDE4] rounded-full flex items-center justify-center mx-auto text-[#F2EDE4]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 className="text-2xl md:text-4xl font-editorial-heading font-black text-[#F2EDE4]">
          Project Brief Confirmed!
        </h3>

        <p className="text-sm text-[#D1C7BB]/90 max-w-lg mx-auto leading-relaxed">
          Thank you, <span className="font-bold text-[#F2EDE4]">{formData.fullName}</span>. Your brief for <span className="font-bold text-[#F2EDE4]">{formData.brandName}</span> has been securely logged into our system.
        </p>

        <div className="p-4 bg-[#101010] border border-[#3A332D] rounded text-xs text-[#B6AB9F] max-w-md mx-auto">
          <p className="font-bold text-[#F2EDE4] mb-1">Expected Response Time</p>
          <p>We review every brief and respond within 24 to 48 hours with a customized proposal and timeline.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hi Tayyab! I just submitted a project brief for ${formData.brandName} (${formData.email}). Looking forward to collaborating!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:bg-[#E98156] transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Continue on WhatsApp
          </a>

          <a
            href={settings.consultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-[#201C18] border border-[#3A332D] text-[#F2EDE4] font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 hover:border-[#F2EDE4] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#F2EDE4]" /> Book Consultation
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#171614] border border-[#3A332D] p-6 md:p-10 rounded-2xl space-y-8">
      <input
        type="text"
        name="website_url_hp"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="flex items-center justify-between border-b border-[#3A332D] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#B6AB9F]">
            Step {step} of 3
          </span>
          <h3 className="font-editorial-heading font-bold text-lg text-[#F2EDE4]">
            {step === 1 && '1. Contact & Brand Info'}
            {step === 2 && '2. Scope & Design Services'}
            {step === 3 && '3. Budget, Timeline & Brief Details'}
          </h3>
        </div>

        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-1 rounded ${s <= step ? 'bg-[#D96A3B]' : 'bg-[#29231F]'}`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-[#201C18] border border-[#F2EDE4]/30 rounded text-[#F2EDE4] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#D1C7BB]" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6 animate-fade-in-slide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g. Antoine Laurent"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Brand or Company Name *
              </label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleInputChange}
                placeholder="e.g. NOCTURNE ATELIER"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="contact@brand.com"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                WhatsApp / Phone Number
              </label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="e.g. France, USA, Japan"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2">Time Zone</label>
              <input
                type="text"
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                placeholder="e.g. GMT+1 / EST"
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in-slide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Project Type
              </label>
              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              >
                <option value="New Clothing Line">New Clothing Brand Launch</option>
                <option value="Seasonal Capsule Drop">Seasonal Capsule Drop</option>
                <option value="Single Hero Graphic">Single Hero Graphic</option>
                <option value="Full Rebrand & Direction">Full Rebrand & Apparel Direction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Primary Clothing Category
              </label>
              <select
                name="clothingCategory"
                value={formData.clothingCategory}
                onChange={handleInputChange}
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              >
                <option value="Streetwear">Streetwear Graphics</option>
                <option value="Cultural & Traditional">Cultural & Traditional</option>
                <option value="Typography-Based">Typography-Based Apparel</option>
                <option value="Illustration-Based">Illustration-Based Apparel</option>
                <option value="Jerseys & Sportswear">Jerseys & Sportswear</option>
                <option value="Collection Development">Collection Development</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-3 font-bold">
              Required Design Services (Select All That Apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                'Streetwear Graphic Design',
                'Cultural & Traditional Apparel',
                'T-shirt and Hoodie Graphics',
                'Jersey and Sportswear Design',
                'Typography-Based Design',
                'Illustration-Based Apparel',
                'Collection Creative Direction',
                'Garment Mockup Design',
                'Production-Ready Tech Packs',
              ].map((srv) => {
                const checked = formData.requiredServices.includes(srv);
                return (
                  <label
                    key={srv}
                    className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                      checked
                        ? 'bg-[#201C18] border-[#F2EDE4] text-[#F2EDE4]'
                        : 'bg-[#101010] border-[#3A332D] text-[#B6AB9F]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCheckboxChange(srv)}
                      className="accent-[#D96A3B]"
                    />
                    <span>{srv}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in-slide">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="brief-budget" className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Budget Range
              </label>
              <input
                id="brief-budget"
                type="text"
                name="budgetRange"
                list="brief-budget-options"
                value={formData.budgetRange}
                onChange={handleInputChange}
                placeholder="e.g. PKR 25,000 or $300 - $600"
                aria-describedby="brief-budget-help"
                maxLength={100}
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              />
              <datalist id="brief-budget-options">
                <option value="$500 - $1,000" />
                <option value="$1,000 - $2,500" />
                <option value="$2,500 - $5,000" />
                <option value="$5,000+" />
              </datalist>
              <p id="brief-budget-help" className="mt-2 text-xs text-[#A99E92]">
                Choose a suggestion or type your own amount, range and currency.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
                Desired Delivery Timeline
              </label>
              <select
                name="deliveryTimeline"
                value={formData.deliveryTimeline}
                onChange={handleInputChange}
                className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              >
                <option value="Rush (1 Week)">Rush Delivery (1 Week)</option>
                <option value="2-3 Weeks">Standard (2-3 Weeks)</option>
                <option value="1 Month+">Flexible (1 Month+)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
              Project Description & Requirements *
            </label>
            <textarea
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe your design challenge, desired garment cuts, printing technique preferences (Puff, DTG, Embroidery), theme inspirations, etc."
              className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2">
              Reference Links (Pinterest, Instagram, Drive)
            </label>
            <input
              type="text"
              name="referenceLinks"
              value={formData.referenceLinks}
              onChange={handleInputChange}
              placeholder="https://pinterest.com/board-link..."
              className="w-full bg-[#101010] border border-[#3A332D] focus:border-[#D96A3B] text-[#F2EDE4] text-sm p-3 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2">
              Upload Brief Files or Moodboard Assets
            </label>
            <div className="border-2 border-dashed border-[#3A332D] p-6 rounded text-center bg-[#101010] hover:border-[#F2EDE4]/50 transition-colors">
              <Upload className="w-6 h-6 text-[#F2EDE4] mx-auto mb-2" />
              <p className="text-xs text-[#B6AB9F]">Drag & drop moodboard files here, or click to upload</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload-input"
              />
              <label
                htmlFor="file-upload-input"
                className="inline-block mt-3 px-4 py-1.5 bg-[#201C18] border border-[#3A332D] text-xs text-[#D1C7BB] uppercase font-bold rounded cursor-pointer hover:bg-[#E98156] hover:text-[#101010] transition-colors"
              >
                Browse Files
              </label>

              {formData.fileUploadNames.length > 0 && (
                <div className="mt-3 text-xs text-[#D1C7BB] text-left border-t border-[#3A332D] pt-2">
                  <p className="font-bold text-[10px] uppercase">Selected Files:</p>
                  <ul className="list-disc list-inside">
                    {formData.fileUploadNames.map((name, i) => (
                      <li key={i}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D1C7BB] mb-2 font-bold">
              Preferred Follow-Up Contact Method
            </label>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {[
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'email', label: 'Email' },
                { id: 'consultation', label: 'Video Call' },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`p-3 border rounded text-center cursor-pointer transition-all ${
                    formData.preferredContact === method.id
                      ? 'bg-[#201C18] border-[#F2EDE4] text-[#F2EDE4]'
                      : 'bg-[#101010] border-[#3A332D] text-[#B6AB9F]'
                  }`}
                >
                  <input
                    type="radio"
                    name="preferredContact"
                    value={method.id}
                    checked={formData.preferredContact === method.id}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <span>{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-[#B6AB9F]">
              <input
                type="checkbox"
                checked={formData.privacyConsent}
                onChange={(e) => setFormData((prev) => ({ ...prev, privacyConsent: e.target.checked }))}
                className="mt-0.5 accent-[#D96A3B]"
                required
              />
              <span>
                I consent to Tayyabs.Designs storing my project brief details for communication and proposal generation.
              </span>
            </label>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t border-[#3A332D]">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-2.5 text-xs uppercase tracking-wider text-[#D1C7BB] border border-[#3A332D] rounded hover:bg-[#201C18] transition-colors"
          >
            ← Previous
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-3 text-xs uppercase tracking-widest font-bold text-[#101010] bg-[#D96A3B] hover:bg-[#E98156] rounded-2xl transition-colors"
          >
            Next Step →
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 text-xs uppercase tracking-widest font-bold text-[#101010] bg-[#D96A3B] hover:bg-[#E98156] rounded-2xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verifying Brief...
              </>
            ) : (
              <>
                Submit Brief <Send className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
};




