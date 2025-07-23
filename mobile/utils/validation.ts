import type { User, UserRequest } from "../types/user.types";

export class ValidationUtils {
  // Validate email format and domain
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email.trim()) {
      return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }

    if (!email.toLowerCase().endsWith("@ashesi.edu.gh")) {
      return {
        isValid: false,
        error: "Please use your Ashesi email address (@ashesi.edu.gh)",
      };
    }

    return { isValid: true };
  }

  // Validate password strength
  static validatePassword(password: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!password) {
      return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        error: "Password must be at least 6 characters long",
      };
    }

    // Add more password requirements as needed
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return {
        isValid: false,
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      };
    }

    return { isValid: true };
  }

  // Validate user data for registration
  static validateUserData(userData: Partial<User>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields
    if (!userData.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!userData.lastName?.trim()) {
      errors.push("Last name is required");
    }

    // Email validation
    if (userData.email) {
      const emailValidation = this.validateEmail(userData.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error!);
      }
    } else {
      errors.push("Email is required");
    }

    // Role validation
    if (!userData.role) {
      errors.push("User role is required");
    }

    // Country validation
    if (!userData.country?.trim()) {
      errors.push("Country is required");
    }

    // Gender validation
    if (!userData.gender) {
      errors.push("Gender is required");
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate user request data
  static validateUserRequest(requestData: Partial<UserRequest>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields
    if (!requestData.firstName?.trim()) {
      errors.push("First name is required");
    }

    if (!requestData.lastName?.trim()) {
      errors.push("Last name is required");
    }

    // Email validation
    if (requestData.email) {
      const emailValidation = this.validateEmail(requestData.email);
      if (!emailValidation.isValid) {
        errors.push(emailValidation.error!);
      }
    } else {
      errors.push("Email is required");
    }

    // Student ID validation
    if (!requestData.studentId?.trim()) {
      errors.push("Student ID is required");
    }

    // Year group validation
    if (!requestData.yearGroup) {
      errors.push("Year group is required");
    }

    // Major validation
    if (!requestData.major) {
      errors.push("Major is required");
    }

    // Country validation
    if (!requestData.country?.trim()) {
      errors.push("Country is required");
    }

    // Gender validation
    if (!requestData.gender) {
      errors.push("Gender is required");
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validate admin credentials
  static validateAdminCredentials(
    adminCode: string,
    email: string,
    password: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!adminCode.trim()) {
      errors.push("Admin access code is required");
    }

    const emailValidation = this.validateEmail(email);
    if (!emailValidation.isValid) {
      errors.push(emailValidation.error!);
    }

    if (!password.trim()) {
      errors.push("Password is required");
    }

    return { isValid: errors.length === 0, errors };
  }

  // Sanitize user input
  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, "");
  }

  // Check if user has required permissions
  static hasPermission(
    user: User,
    permission: keyof User["permissions"]
  ): boolean {
    return user.permissions?.[permission] === true;
  }
}
