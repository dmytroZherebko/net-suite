<template>
    <div>
        <header class="form-header">
            <router-link
                    class="form-header__back"
                    :to="prevPage"
            >
                &#8678;
            </router-link>
            <h1 class="form-header__title">
                LinkToFill
            </h1>
        </header>
        <div class="form">
            <h2 class="form__title">
                {{ this.$route.params.l2f_id ? "Edit LinkToFill" : `Create new LinkToFill for ${currentDocumentName}.${currentDocumentType} document`}}
            </h2>
            <form-section
                    title="Set Access Privileges">
                <switcher-radio
                        slot="form-control"
                        v-model="formData.access"
                        :inputs="[{value: 'full', title: 'Edit & Sign'}, {value: 'signature', title: 'Sign only'}]"
                        radio-name="access"
                />
            </form-section>

            <form-section
                    title="Set Access Permissions">
                <switcher-radio
                        slot="form-control"
                        v-model="formData.status"
                        :inputs="[{value: 'public', title: 'Public'}, {value: 'private', title: 'Private'}]"
                        radio-name="status"
                />
            </form-section>

            <form-section
                    title="Allow User to Get a Copy">
                <switcher-component
                        v-model="formData.allow_downloads"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Verify by Email">
                <switcher-component
                        v-model="formData.email_required"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Verify by Name">
                <switcher-component
                        v-model="formData.name_required"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Request additional documents">
                <tags-component
                        slot="form-control"
                        :tags-list="formData.additional_documents"
                        :has-error="additionalDocumentError"
                        :max-items="5"
                        placeholder="Add document name"
                        @add-tag-item="addAdditionalDocument($event)"
                        @remove-tag-item="removeAdditionalDocument($event)"
                        @reset-tag-input-error="resetAdditionalDocumentError"
                />
            </form-section>

            <form-section
                    title="Enforce Required Fields">
                <switcher-component
                        v-model="formData.enforce_required_fields"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Add a 'Verified by PDFfiller' signature stamp">
                <switcher-component
                        v-model="formData.signature_stamp"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Send notifications">
                <switcher-component
                        v-model="formData.sender_notifications"
                        slot="form-control"
                />
            </form-section>

            <form-section
                    title="Send Notifications to">
                <tags-component
                        slot="form-control"
                        :tags-list="formData.notification_emails"
                        :has-error="notificationEmailError"
                        :max-items="10"
                        value-field="email"
                        placeholder="Add Email Address"
                        @add-tag-item="addNotificationEmail($event)"
                        @remove-tag-item="removeNotificationEmail($event)"
                        @reset-tag-input-error="resetNotificationEmailError"
                />
            </form-section>

            <form-section
                    title="Always Show Welcome Agreement">
                <switcher-component v-model="formData.welcome_screen"
                                    slot="form-control" />
            </form-section>

            <form-section
                    title="Redirect After Submission">
                <input class="input"
                       :class="{'input_invalid': redirectUrlError}"
                       slot="form-control"
                       type="text"
                       :value="formData.redirect_url"
                       @input="updateRedirectUrl">
            </form-section>

            <form-section
                    title="LinkToFill Custom Message">
                <textarea
                        slot="form-control"
                        class="input input_textarea"
                        type="text"
                        v-model="formData.custom_message"
                        maxlength="500"
                ></textarea>
            </form-section>

            <form-section
                    title="Send to Owner as Fillable Form">
                <switcher-component v-model="formData.reusable"
                                    slot="form-control" />
            </form-section>

            <button class="button button_primary form-button"
                    @click="createL2F"
            >
                Create LinkToFill
            </button>
        </div>

        <result-modal
                :show-submit-modal="showSubmitModal"
                :close-submit-modal="closeSubmitModal"
                :copy-url="copyUrl"
                :link-to-fill-url="linkToFillUrl"
        />
    </div>
</template>

<script src="./LinkToFillForm.js"></script>