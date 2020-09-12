Vue.mixin({
	created() {
		this.vRules = {
            required(msg = "این فیلد الزامی است.") {
                return function validator(value = "") {
                    if (!value || (Array.isArray(value) && value.length === 0)) {
                        return msg;
                    }
                    return true;
                };
            },
            minLength(length, msg = "") {
                msg = msg || `این فیلد باید حداقل شامل ${engToPerDigits(length)} حرف باشد.`;
                return function validator(value = "") {
                    if (value.length < length) {
                        return msg;
                    }
                    return true;
                };
            },
            maxLength(length, msg = "") {
                msg = msg || `این فیلد می‌تواند حداکثر شامل ${engToPerDigits(length)} حرف باشد.`;
                return function validator(value = "") {
                    if (value.length > length) {
                        return msg;
                    }
                    return true;
                };
            },
            exactLength(length, msg = "") {
                msg = msg || `این فیلد باید دقیقا شامل ${engToPerDigits(length)} حرف باشد.`;
                return function validator(value = "") {
                    if (value.length !== length) {
                        return msg;
                    }
                    return true;
                };
            },
            nationalCode(value = "") {
                value = perToEngDigits(value);
                if (/^\d{10}$/.test(value) === false) {
                    return "کد ملی باید دقیقا ۱۰ رقم باشد.";
                }
                let tmp = 0;
                for (let i = 8; i >= 0; i--) {
                    tmp += (i + 2) * parseInt(value[8 - i], 10);
                }
                tmp %= 11;
                if (tmp >= 2) {
                    tmp = 11 - tmp;
                }
                return tmp.toString() === value[9] ? true : "کد ملی نامعتبر است.";
            },
            nationalId(value = "") {
                value = perToEngDigits(value);
                if (/^\d{11}$/.test(value) === false) {
                    return "شناسه ملی باید دقیقا ۱۱ رقم باشد.";
                }
                const multiplier = parseInt(value[9], 10) + 2;
                const coef = [29, 27, 23, 19, 17, 29, 27, 23, 19, 17];
                let sum = 0;
                for (let i = 0; i < 10; i++) {
                    sum += (parseInt(value[i], 10) + multiplier) * coef[i];
                }
                let remainder = sum % 11;
                if (remainder === 10) {
                    remainder = 0;
                }
                return remainder === parseInt(value[10], 10) ? true : "شناسه ملی نامعتبر است.";
            },
            economicNumber(value = "") {
                return /^\d{12}$/.test(perToEngDigits(value)) ? true : "شماره اقتصادی باید دقیقا ۱۲ رقم باشد.";
            },
            phone(msg = "") {
                return function validator(value = "") {
                    return /^09\d{9}$/.test(perToEngDigits(value)) || /^9\d{9}$/.test(perToEngDigits(value)) || /^\+989\d{9}$/.test(perToEngDigits(value))
                        ? true
                        : msg || "شماره تلفن همراه باید ۱۱ رقم بوده و با ۰۹ شروع شود.";
                };
            },
            landlinePhone(value = "") {
                return /^0\d{6,}$/.test(perToEngDigits(value)) ? true : "شماره تلفن ثابت باید ۱۱ رقم بوده و با صفر شروع شود.";
            },
            postalCode(value = "") {
                return /^\d{10}$/.test(perToEngDigits(value)) ? true : "کد پستی باید دقیقا ۱۰ رقم باشد.";
            },
            website(value = "") {
                // https://gist.github.com/dperini
                return /^(?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00A1-\uFFFF][a-z0-9\u00A1-\uFFFF_-]{0,62})?[a-z0-9\u00A1-\uFFFF]\.)+(?:[a-z\u00A1-\uFFFF]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
                    perToEngDigits(value.toLowerCase())
                )
                    ? true
                    : 'آدرس وبسایت وارد شده نامعتبر است.';
            },
            telegram(value = "") {
                return /^((https?:\/\/)?(www\.)?(t(elegram)?\.me)\/[a-z0-9_]{5,32}(\/)?)$|^@?[a-z0-9_]{5,32}$/i.test(perToEngDigits(value.toLowerCase()))
                    ? true
                    : 'آدرس کانال تلگرام وارد شده نامعتبر است.';
            },
            instagram(value = "") {
                return /^((https?:\/\/)?(www\.)?(instagram\.com)\/(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}(\/)?)$|^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/i.test(
                    perToEngDigits(value.toLowerCase())
                )
                    ? true
                    : 'آدرس پیج اینستاگرام وارد شده نامعتبر است.';
            },
            android_app(value = "") {
                return /^((https?:\/\/)?(www\.)?(play\.google\.com\/store\/apps\/details)(?:[/?#]\S*)+)$|^((https?:\/\/)?(www\.)?(cafebazaar\.ir)(?:[/?#]\S*)+)$|^[a-z][a-z0-9_.]*$/i.test(
                    perToEngDigits(value.toLowerCase())
                )
                    ? true
                    : "آدرس اپلیکیشن اندروید وارد شده نامعتبر است.";
            },
            ios_app(value = "") {
                return /^((https?:\/\/)?(www\.)?(apps\.apple\.com)(?:[/?#]\S*)+)$/i.test(perToEngDigits(value.toLowerCase()))
                    ? true
                    : 'آدرس اپلیکیشن ای‌او‌اس وارد شده نامعتبر است.';
            },
            code(value = "") {
                return /^\d{6}$/.test(perToEngDigits(value)) ? true : "کد وارد شده معتبر نیست.";
            },
            email(msg = "") {
                return function validator(value = "") {
                    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(perToEngDigits(value))
                        ? true
                        : msg || "ایمیل وارد شده نامعتبر است.";
                };
            },
            email_or_phone(msg = "") {
                return function validator(value = "") {
                    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(perToEngDigits(value)) ||
                        /^09\d{9}$/.test(perToEngDigits(value)) ||
                        /^9\d{9}$/.test(perToEngDigits(value)) ||
                        /^\+989\d{9}$/.test(perToEngDigits(value))
                        ? true
                        : msg ||
                              'ایمیل یا شماره موبایل وارد شده معتبر نیست.<br> فرمت صحیح شماره موبایل: <span class="ltr d-inline-block">09*********</span> <br> فرمت صحیح ایمیل : <span class="ltr d-inline-block">**@**.**</span>';
                };
            },
            password(msg = "") {
                return function validator(value = "") {
                    return value.length >= 6 ? true : msg || "گذرواژه باید حداقل ۶ حرف باشد.";
                };
            },
            password_repeat(main_password) {
                return function validator(value = "") {
                    return main_password === value
                        ? true
                        : "تکرار گذرواژه با اصل آن یکسان نیست.";
                };
			},
        };
	},
});
// 'فرمت های صحیح شماره موبایل : <div class="ltr mt-1">09*********</div><div class="ltr">9*********</div><div class="ltr mb-2">+989*********</div>فرمت صحیح ایمیل : <div class="ltr mt-1">**@**.**</div>';
