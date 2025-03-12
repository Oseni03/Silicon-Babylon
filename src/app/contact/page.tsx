"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
	name: z.string().min(2, { message: "Name must be at least 2 characters" }),
	email: z.string().email({ message: "Please enter a valid email address" }),
	subject: z
		.string()
		.min(5, { message: "Subject must be at least 5 characters" }),
	message: z
		.string()
		.min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			subject: "",
			message: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			toast.success("Message sent successfully! We'll be in touch soon.");
			form.reset();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow pt-24 pb-16">
				<div className="container mx-auto px-6">
					<div className="max-w-3xl mx-auto">
						<div className="text-center space-y-4 mb-12">
							<div className="inline-block px-3 py-1 rounded-full bg-secondary border border-border text-xs font-medium">
								Contact Us
							</div>
							<h1 className="text-4xl font-medium tracking-tight">
								Get in Touch
							</h1>
							<p className="text-lg text-muted-foreground">
								Have questions, feedback, or just want to say
								hello? We'd love to hear from you.
							</p>
						</div>

						<div className="bg-card border border-border rounded-lg p-8">
							<h2 className="text-2xl font-medium mb-6">
								Send Us a Message
							</h2>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-6"
								>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															placeholder="Your name"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="email"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															placeholder="your.email@example.com"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="subject"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subject</FormLabel>
												<FormControl>
													<Input
														placeholder="What is this regarding?"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="message"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Message</FormLabel>
												<FormControl>
													<Textarea
														placeholder="How can we help you?"
														className="min-h-[150px]"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex justify-end">
										<Button
											type="submit"
											disabled={isSubmitting}
										>
											{isSubmitting
												? "Sending..."
												: "Send Message"}
										</Button>
									</div>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
};

export default ContactPage;
