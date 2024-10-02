interface ButtonStyle {
  button: {
    backgroundColor: string;
    borderWidth?: number;
    borderColor?: string;
  };
  title: {
    color: string;
  };
  value: {
    color: string;
  }
  icon: {
    color: string;
  };
}

export interface ButtonVariant {
  enabled: ButtonStyle;
  disabled: ButtonStyle;
}

const buttonPrimary: ButtonVariant = {
  enabled: {
    button: {
      backgroundColor: "#ff5333",
    },
    title: {
      color: "#FFF",
    },
    value: {
      color: "#fae632",
    },
    icon: {
      color: "#FFF",
    },
  },
  disabled: {
    button: {
      backgroundColor: "#B8B8B8",
    },
    title: {
      color: "#FFF",
    },
    value: {
      color: "#fae632",
    },
    icon: {
      color: "#FFF",
    },
  },
};

export const variants = {
  primary: buttonPrimary,
};