import * as React from "react";
import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Body } from "@react-email/body";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Link } from "@react-email/link";
import { Tailwind } from "@react-email/tailwind";

interface VerificationTemplateProps {
	domain: string;
	token: string;
}

export function VerificationTemplate({ domain, token }: VerificationTemplateProps) {
	const verificationLink = `${domain}/account/verify?token=${token}`;

	return (
		<Html>
			<Head />
			<Preview>Верификация аккаунта</Preview>

			<Tailwind>
				<Body className="max-w-2xl mx-auto p-6 bg-slate-50">
					<Section className="text-center mb-8">
						<Heading className="text-3xl text-black font-bold">
							Подтверждение вашей почты
						</Heading>

						<Text className="text-base text-black">
							Спасибо за регистрацию в Teastream! Чтобы подтвердить свой адрес
							электронной почты, пожалуйста, перейдите по следующей ссылке:
						</Text>

						<Link
							href={verificationLink}
							className="inline-flex
							justify-center items-center rounded-full text-sm
							font-medium text-white bg-[#18B9AE] px-5 py-2"
						>
							Подтвердить почту
						</Link>
					</Section>

					<Section className="text-center mt-8">
						<Text className="text-gray-600">
							Если у вас есть вопросы или вы столкнулись с трудностями,
							обращайтесь в нашу службу поддержки по адресу{" "}
							<Link href="mailto:help@gmail.com" className="text-[#18B9AE] underline">
								help@gmail.com
							</Link>
						</Text>
					</Section>
				</Body>
			</Tailwind>
		</Html>
	);
}
