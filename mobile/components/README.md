# Beautiful Error Boundaries for FreshmanHub

This project includes two stunning error boundary components that provide a beautiful and user-friendly way to handle errors in your React Native app.

## 🎨 Features

### Basic Error Boundary (`ErrorBoundary.tsx`)

- **Beautiful UI**: Gradient backgrounds, blur effects, and smooth animations
- **Responsive Design**: Adapts to different screen sizes
- **Theme Support**: Automatically adapts to light/dark themes
- **Haptic Feedback**: Provides tactile feedback on iOS devices
- **Floating Particles**: Animated background particles for visual appeal
- **Smooth Animations**: Spring animations and transitions

### Advanced Error Boundary (`AdvancedErrorBoundary.tsx`)

- **Everything from Basic** plus:
- **Error Reporting**: Automatically stores error reports locally
- **Auto-Restart**: Configurable auto-restart functionality
- **Error Sharing**: Share detailed error reports via native share sheet
- **Error Tracking**: Tracks error count and provides unique error IDs
- **Collapsible Details**: Show/hide technical error information
- **Enhanced Animations**: More sophisticated particle system and animations

## 🚀 Usage

### Basic Implementation

```tsx
import ErrorBoundary from "@/components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <YourAppContent />
    </ErrorBoundary>
  );
}
```

### Advanced Implementation

```tsx
import AdvancedErrorBoundary from "@/components/AdvancedErrorBoundary";

export default function App() {
  return (
    <AdvancedErrorBoundary
      enableReporting={true}
      enableAutoRestart={true}
      autoRestartDelay={5000}
      onError={(error, errorInfo, errorId) => {
        // Custom error handling
        console.log("Error caught:", errorId);
        // Send to crash reporting service
      }}
    >
      <YourAppContent />
    </AdvancedErrorBoundary>
  );
}
```

### Custom Fallback Component

```tsx
import ErrorBoundary from "@/components/ErrorBoundary";

const CustomErrorFallback = (error: Error, resetError: () => void) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Custom Error UI</Text>
    <TouchableOpacity onPress={resetError}>
      <Text>Try Again</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  return (
    <ErrorBoundary fallback={CustomErrorFallback}>
      <YourAppContent />
    </ErrorBoundary>
  );
}
```

## 🔧 Props

### ErrorBoundary Props

| Prop       | Type                                                  | Default | Description               |
| ---------- | ----------------------------------------------------- | ------- | ------------------------- |
| `children` | `ReactNode`                                           | -       | The components to wrap    |
| `fallback` | `(error: Error, resetError: () => void) => ReactNode` | -       | Custom fallback component |

### AdvancedErrorBoundary Props

| Prop                | Type                                                                   | Default | Description                           |
| ------------------- | ---------------------------------------------------------------------- | ------- | ------------------------------------- |
| `children`          | `ReactNode`                                                            | -       | The components to wrap                |
| `fallback`          | `(error: Error, resetError: () => void, errorId: string) => ReactNode` | -       | Custom fallback component             |
| `onError`           | `(error: Error, errorInfo: React.ErrorInfo, errorId: string) => void`  | -       | Custom error handler                  |
| `enableReporting`   | `boolean`                                                              | `false` | Enable local error storage            |
| `enableAutoRestart` | `boolean`                                                              | `false` | Enable automatic restart after errors |
| `autoRestartDelay`  | `number`                                                               | `5000`  | Delay before auto-restart (ms)        |

## 🎯 Best Practices

### 1. Wrap at the Right Level

```tsx
// ✅ Good: Wrap your entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// ✅ Good: Wrap specific features
<ErrorBoundary>
  <ComplexFeature />
</ErrorBoundary>

// ❌ Avoid: Wrapping every single component
```

### 2. Use Multiple Boundaries

```tsx
<ErrorBoundary>
  {" "}
  {/* App-level boundary */}
  <NavigationContainer>
    <ErrorBoundary>
      {" "}
      {/* Feature-level boundary */}
      <UserProfile />
    </ErrorBoundary>
    <ErrorBoundary>
      {" "}
      {/* Feature-level boundary */}
      <ChatSystem />
    </ErrorBoundary>
  </NavigationContainer>
</ErrorBoundary>
```

### 3. Custom Error Reporting

```tsx
<AdvancedErrorBoundary
  enableReporting={true}
  onError={(error, errorInfo, errorId) => {
    // Send to your crash reporting service
    crashlytics().recordError(error);

    // Send to analytics
    analytics().logEvent("error_boundary_triggered", {
      errorId,
      errorMessage: error.message,
    });
  }}
>
  <App />
</AdvancedErrorBoundary>
```

## 🎨 Customization

### Theme Integration

The error boundaries automatically integrate with your app's color scheme:

```tsx
// The error boundary will automatically use your theme colors
const colors = Colors[colorScheme ?? "light"];
```

### Custom Styling

You can override styles by passing a custom fallback component:

```tsx
const CustomStyledFallback = (error: Error, resetError: () => void) => (
  <View style={yourCustomStyles}>{/* Your custom error UI */}</View>
);
```

## 🐛 Testing Error Boundaries

Use the included `ErrorTrigger` component to test your error boundaries:

```tsx
import ErrorTrigger from "@/components/ErrorTrigger";

// Add this to any screen to test error boundaries
<ErrorTrigger />;
```

## 📱 Features Breakdown

### Visual Elements

- **Gradient Backgrounds**: Beautiful color gradients that adapt to theme
- **Blur Effects**: Subtle backdrop blur for depth
- **Floating Particles**: Animated background elements
- **Glow Effects**: Subtle glow around the error icon
- **Smooth Animations**: Spring-based animations for natural feel

### User Experience

- **Clear Messaging**: User-friendly error messages
- **Multiple Actions**: Try again, go home, share report
- **Haptic Feedback**: Tactile feedback on supported devices
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper accessibility labels and focus management

### Developer Experience

- **TypeScript Support**: Full TypeScript definitions
- **Error Tracking**: Unique error IDs and tracking
- **Local Storage**: Automatic error report storage
- **Custom Handlers**: Flexible error handling hooks
- **Debug Information**: Detailed error information in development

## 🔍 Error Report Format

When using the advanced error boundary with reporting enabled, errors are stored in this format:

```json
{
  "id": "error_1640995200000_abc123def",
  "message": "Cannot read property 'foo' of undefined",
  "stack": "Error: Cannot read property 'foo' of undefined\\n    at Component...",
  "componentStack": "\\n    in Component\\n    in ErrorBoundary\\n    in App",
  "timestamp": "2021-12-31T23:59:59.999Z",
  "userAgent": "ios",
  "version": "15.0"
}
```

## 🛡️ Error Boundary Limitations

Error boundaries do **not** catch errors in:

- Event handlers
- Asynchronous code (e.g., setTimeout, requestAnimationFrame callbacks)
- Server-side rendering
- Errors thrown in the error boundary itself

For these cases, use traditional try-catch blocks or Promise.catch().

## 📦 Dependencies

The error boundaries use these dependencies (already included in your project):

- `expo-blur` - For backdrop blur effects
- `expo-linear-gradient` - For gradient backgrounds
- `expo-haptics` - For haptic feedback
- `@expo/vector-icons` - For icons
- `@react-native-async-storage/async-storage` - For local error storage (Advanced only)

## 🚀 Getting Started

1. The error boundaries are already integrated into your app's root layout
2. Test them using the `ErrorTrigger` component
3. Customize the styling and behavior as needed
4. Add error reporting integration for production use

Your app now has beautiful, user-friendly error handling that will keep users engaged even when things go wrong! 🎉
