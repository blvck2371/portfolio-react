import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { slideIn } from "../../utils/motion";
import { config } from "../../constants/config";
import { Header } from "../atoms/Header";
import { SocialLinks } from "../SocialLinks";
import { fetchProfile } from "../../api/portfolio";
import type { TProfile } from "../../types";

const INITIAL_STATE = Object.fromEntries(
  Object.keys(config.contact.form).map((input) => [input, ""])
);

const emailjsConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
  templateIdAutoReply: import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTO_REPLY ?? "",
  publicKey: import.meta.env.VITE_EMAILJS_ACCESS_TOKEN ?? "",
};

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [form, setForm] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<TProfile | null>(null);

  useEffect(() => {
    fetchProfile().then(setProfile);
  }, []);

  // Initialiser EmailJS avec la clé publique (obligatoire pour send())
  useEffect(() => {
    if (emailjsConfig.publicKey) {
      emailjs.init(emailjsConfig.publicKey);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    if (e === undefined) return;
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | undefined) => {
    if (e === undefined) return;
    e.preventDefault();
    if (!emailjsConfig.publicKey || !emailjsConfig.serviceId || !emailjsConfig.templateId) {
      alert("Configuration email manquante. Vérifiez le fichier .env (VITE_EMAILJS_ACCESS_TOKEN, etc.) et redémarrez le serveur.");
      return;
    }
    setLoading(true);

    const payloadToAdmin = {
      form_name: form.name,
      to_name: profile?.fullName ?? "",
      from_email: form.email,
      to_email: profile?.email ?? "",
      message: form.message,
    };

    const replyTitle =
      form.message.length > 80 ? form.message.slice(0, 80).trim() + "…" : form.message.trim() || "Votre message";

    emailjs
      .send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        payloadToAdmin,
        emailjsConfig.publicKey
      )
      .then(
        () => {
          // Auto-réponse stylisée au visiteur (si template configuré)
          if (emailjsConfig.templateIdAutoReply && form.email) {
            emailjs
              .send(
                emailjsConfig.serviceId,
                emailjsConfig.templateIdAutoReply,
                {
                  name: form.name,
                  title: replyTitle,
                  message: form.message,
                  from_email: form.email,
                },
                emailjsConfig.publicKey
              )
              .catch(() => { /* ne pas bloquer le succès principal */ });
          }
          setLoading(false);
          alert(
            "Merci pour votre message. Je vous répondrai dès que possible."
          );
          setForm(INITIAL_STATE);
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Une erreur est survenue. Veuillez réessayer plus tard.");
        }
      );
  };

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto max-w-7xl px-6 py-12 sm:px-16 sm:py-16 xl:mt-12"
    >
      <span className="hash-span">&nbsp;</span>
      {/* Fond image dans App (pleine largeur). Section en transparent pour laisser voir l'image. */}
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="mx-auto max-w-xl bg-black-100/95 rounded-2xl p-8 shadow-xl"
      >
        <Header useMotion={false} {...config.contact} />

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          {Object.keys(config.contact.form).map((input) => {
            const { span, placeholder } =
              config.contact.form[input as keyof typeof config.contact.form];
            const Component = input === "message" ? "textarea" : "input";

            return (
              <label key={input} className="flex flex-col">
                <span className="mb-4 font-medium text-white">{span}</span>
                <Component
                  type={input === "email" ? "email" : "text"}
                  name={input}
                  value={form[`${input}`]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="bg-tertiary placeholder:text-secondary rounded-lg border-none px-6 py-4 font-medium text-white outline-none"
                  {...(input === "message" && { rows: 7 })}
                />
              </label>
            );
          })}
          <button
            type="submit"
            className="bg-tertiary shadow-primary w-fit rounded-xl px-8 py-3 font-bold text-white shadow-md outline-none"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </form>
        <SocialLinks />
      </motion.div>
    </section>
  );
};

export default Contact;
