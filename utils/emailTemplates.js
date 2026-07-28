const dueSoonTemplate = (taskTitle, dueDate) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TaskFlow</h1>
    </div>
    <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1e293b;">⏰ Task Due Soon!</h2>
      <p style="color: #475569;">Your task is due within the next hour:</p>
      <div style="background: white; border: 1px solid #e2e8f0;
        border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="color: #2563eb; margin: 0 0 8px 0;">${taskTitle}</h3>
        <p style="color: #64748b; margin: 0;">
          Due: <strong>${new Date(dueDate).toLocaleString()}</strong>
        </p>
      </div>
      <p style="color: #475569;">Login to TaskFlow to complete your task on time!</p>
      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display: inline-block; background: #2563eb; color: white;
        padding: 12px 24px; border-radius: 8px; text-decoration: none;
        font-weight: bold; margin-top: 8px;">
        View Task
      </a>
    </div>
  </div>
`;

const completedTemplate = (taskTitle, userName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TaskFlow</h1>
    </div>
    <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1e293b;">🎉 Task Completed!</h2>
      <p style="color: #475569;">Great work, ${userName}! You completed:</p>
      <div style="background: white; border: 1px solid #e2e8f0;
        border-radius: 8px; padding: 16px; margin: 16px 0;">
        <h3 style="color: #16a34a; margin: 0;">${taskTitle}</h3>
      </div>
      <p style="color: #475569;">
        Keep up the great work! Head back to TaskFlow to tackle your next task.
      </p>
      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display: inline-block; background: #2563eb; color: white;
        padding: 12px 24px; border-radius: 8px; text-decoration: none;
        font-weight: bold; margin-top: 8px;">
        Go to Dashboard
      </a>
    </div>
  </div>
`;

const welcomeTemplate = (userName) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: #2563eb; padding: 24px; border-radius: 12px 12px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">TaskFlow</h1>
    </div>
    <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 12px 12px;">
      <h2 style="color: #1e293b;">👋 Welcome to TaskFlow, ${userName}!</h2>
      <p style="color: #475569;">
        Your account has been created successfully.
        Start managing your tasks efficiently today!
      </p>
      <a href="${process.env.CLIENT_URL}/dashboard"
        style="display: inline-block; background: #2563eb; color: white;
        padding: 12px 24px; border-radius: 8px; text-decoration: none;
        font-weight: bold; margin-top: 8px;">
        Go to Dashboard
      </a>
    </div>
  </div>
`;

module.exports = { dueSoonTemplate, completedTemplate, welcomeTemplate };