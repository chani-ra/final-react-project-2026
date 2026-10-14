export function validateRegisterStep(step, data) {
  const errors = {};
  const text = (value) => String(value ?? "").trim();

  switch (step) {
    case 1:
      if (text(data.username).length < 2)
        errors.username = "השם צריך להכיל לפחות 2 תווים.";
      else if (text(data.username).length > 80)
        errors.username = "השם ארוך מדי (מקסימום 80 תווים).";
      break;

    case 2:
      if (!["female", "male"].includes(data.gender))
        errors.gender = "בחרי אחת מהאפשרויות.";
      break;

    case 3: {
      const age = Number(data.age);
      if (!Number.isInteger(age) || age < 4 || age > 120)
        errors.age = "בחרי גיל תקין.";
      break;
    }

    case 4:
      if (!["child", "parent"].includes(data.parentOrChild))
        errors.parentOrChild = "בחרי אחת מהאפשרויות.";
      break;

    case 5:
      if (!["beginner", "intermediate", "advanced"].includes(data.englishLevel))
        errors.englishLevel = "בחרי רמת אנגלית.";
      break;

    case 6:
      if (!Array.isArray(data.favoriteHobbies) || !data.favoriteHobbies.length)
        errors.favoriteHobbies = "בחרי לפחות תחום עניין אחד.";

      if (!Array.isArray(data.expectations) || !data.expectations.length)
        errors.expectations = "בחרי לפחות מטרה אחת.";
      break;

    case 7:
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(data.email)))
        errors.email = "כתובת האימייל אינה תקינה.";

      if (!text(data.phone))
        errors.phone = "יש להזין מספר טלפון.";

      if (String(data.password ?? "").length < 6)
        errors.password = "הסיסמה חייבת להכיל לפחות 6 תווים.";

      if (!data.confirmPassword)
        errors.confirmPassword = "יש לאמת את הסיסמה.";
      else if (data.password !== data.confirmPassword)
        errors.confirmPassword = "הסיסמאות אינן תואמות.";
      break;

    default:
      break;
  }

  return errors;
}
