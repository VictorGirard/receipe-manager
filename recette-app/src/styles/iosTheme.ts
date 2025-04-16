export const iosTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
    border: '#C6C6C8',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    h1: 'text-2xl sm:text-3xl md:text-4xl font-semibold',
    h2: 'text-xl sm:text-2xl md:text-3xl font-semibold',
    h3: 'text-lg sm:text-xl md:text-2xl font-semibold',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm',
  },
  components: {
    button: {
      primary: 'bg-[#007AFF] text-white rounded-full px-4 py-2 font-medium active:bg-[#0062CC]',
      secondary: 'bg-[#5856D6] text-white rounded-full px-4 py-2 font-medium active:bg-[#4A48B8]',
      outline: 'border border-[#C6C6C8] rounded-full px-4 py-2 font-medium active:bg-[#F2F2F7]',
    },
    card: {
      container: 'bg-white rounded-2xl shadow-sm border border-[#C6C6C8] overflow-hidden',
      content: 'p-4',
    },
    input: {
      container: 'relative',
      field: 'w-full px-4 py-3 rounded-xl border border-[#C6C6C8] bg-white focus:outline-none focus:border-[#007AFF] text-sm',
    },
    list: {
      container: 'bg-white rounded-2xl border border-[#C6C6C8] overflow-hidden',
      item: 'px-4 py-3 border-b border-[#C6C6C8] last:border-b-0 active:bg-[#F2F2F7]',
    },
    modal: {
      container: 'bg-white rounded-t-2xl shadow-lg',
      header: 'px-4 py-3 border-b border-[#C6C6C8]',
      content: 'p-4',
      footer: 'px-4 py-3 border-t border-[#C6C6C8]',
    },
  },
}; 