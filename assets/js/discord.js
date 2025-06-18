document.addEventListener('DOMContentLoaded', () => {
    const userId = "880694639227699290"; // Replace with your hardcoded user ID
    const apiUrl = `https://discord-lookup-api-alpha.vercel.app/v1/user/${userId}`;

    const profilePicture = document.getElementById('profile-picture');
    const avatarFrame = document.getElementById('avatar-frame');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);

            const avatarUrl = data.avatar ? data.avatar.link : './assets/pfp/default.jpg';
            profilePicture.src = avatarUrl;

            if (data.avatar_decoration && data.avatar_decoration.asset) {
                const asset = data.avatar_decoration.asset;
                const frameUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${asset}.png`;
                avatarFrame.src = frameUrl;
                avatarFrame.style.display = 'block';
            } else {
                console.warn("No avatar frame asset found.");
            }

        })
        .catch(error => {
            console.error("Error fetching user data:", error);
        });
});
