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
                    title="Access level for the fill request document">
                <switcher-radio
                        slot="form-control"
                        v-model="formData.access"
                        :inputs="[{value: 'full', title: 'Edit & Sign'}, {value: 'signature', title: 'Sign only'}]"
                        radioName="access"
                ></switcher-radio>
            </form-section>

            <form-section
                    title="Document access permission">
                <switcher-radio
                        slot="form-control"
                        v-model="formData.status"
                        :inputs="[{value: 'public', title: 'Public'}, {value: 'private', title: 'Private'}]"
                        radioName="status"
                ></switcher-radio>
            </form-section>

            <form-section
                    title="User Can Get a Copy">
                <switcher v-model="formData.allow_downloads" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Require email from recipient">
                <switcher v-model="formData.email_required" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Require name from recipient">
                <switcher v-model="formData.name_required" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Request additional documents">
                <tags
                        slot="form-control"
                        :tagsList="formData.additional_documents"
                        :hasError="additionalDocumentError"
                        :maxItems="5"
                        placeholder="Add document name"
                        v-on:add-tag-item="addAdditionalDocument($event)"
                        v-on:remove-tag-item="removeAdditionalDocument($event)"
                        v-on:reset-tag-input-error="resetAdditionalDocumentError"
                ></tags>
            </form-section>

            <form-section
                    title="Prevent closing document before filling all fields">
                <switcher v-model="formData.enforce_required_fields" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Add a 'Verified by PDFfiller' signature stamp">
                <switcher v-model="formData.signature_stamp" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Send notifications">
                <switcher v-model="formData.sender_notifications" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Send Notification to">
                <tags
                        slot="form-control"
                        :tagsList="formData.notification_emails"
                        :hasError="notificationEmailError"
                        :maxItems="10"
                        valueField="email"
                        placeholder="Add Email Address"
                        v-on:add-tag-item="addNotificationEmail($event)"
                        v-on:remove-tag-item="removeNotificationEmail($event)"
                        v-on:reset-tag-input-error="resetNotificationEmailError"
                ></tags>
            </form-section>

            <form-section
                    title="Shows welcome agreement each time when user will open LinkToFill">
                <switcher v-model="formData.welcome_screen" slot="form-control"></switcher>
            </form-section>

            <form-section
                    title="Redirect After Submission">
                <input class="input" slot="form-control" type="text" v-model="formData.redirect_url">
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
                    title="After filling the form it will be copied to the owner as the fillable form">
                <switcher v-model="formData.reusable" slot="form-control"></switcher>
            </form-section>

            <button class="button button_primary form-button"
                    v-on:click="createL2F"
            >
                Create LinkToFill
            </button>
        </div>

        <result-modal
                :showSubmitModal="showSubmitModal"
                :closeSubmitModal="closeSubmitModal"
                :copyUrl="copyUrl"
                :linkToFillUrl="linkToFillUrl"
        ></result-modal>
    </div>
</template>

<script src="./LinkToFillForm.js"></script>